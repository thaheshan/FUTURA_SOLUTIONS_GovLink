import {
  Injectable, Inject, ForbiddenException, HttpException, forwardRef
} from '@nestjs/common';
import { Comprehend } from 'aws-sdk';
import { Model, Types } from 'mongoose';
import { QueueEventService, EntityNotFoundException, getConfig } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { REF_TYPE } from 'src/modules/file/constants';
import { Storage } from 'src/modules/storage/contants';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { PerformerDto } from 'src/modules/performer/dtos';
import { flatten, uniq } from 'lodash';
import {
  MessageModel, IRecipient,
  ToxicityReportModel,
  MessageDetectionKeywordModel
} from '../models';
import { MessageCreatePayload } from '../payloads/message-create.payload';
import {
  CONVERSATION_TYPE,
  DELETE_MESSAGE_CHANNEL,
  MESSAGE_CHANNEL, MESSAGE_EVENT, MESSAGE_PRIVATE_STREAM_CHANNEL
} from '../constants';
import { MessageDto } from '../dtos';
import { ConversationService } from './conversation.service';
import { MessageListRequest } from '../payloads/message-list.payload';
import { MESSAGE_DETECTION_KEYWORD_MODEL_PROVIDER, TOXICITY_REPORT_MODEL_PROVIDER, MESSAGE_MODEL_PROVIDER } from '../providers';

@Injectable()
export class MessageService {
  private readonly comprehend: Comprehend;

  constructor(
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
    @Inject(MESSAGE_DETECTION_KEYWORD_MODEL_PROVIDER)
    private readonly keywordModel: Model<MessageDetectionKeywordModel>,
    @Inject(MESSAGE_MODEL_PROVIDER)
    private readonly messageModel: Model<MessageModel>,
    @Inject(TOXICITY_REPORT_MODEL_PROVIDER)
    private readonly toxicityReportModel: Model<ToxicityReportModel>,
    private readonly queueEventService: QueueEventService,
    private readonly fileService: FileService
  ) {
    this.comprehend = new Comprehend({
      region: getConfig('aws').comprehend.region,
      accessKeyId: getConfig('aws').comprehend.accessKeyId,
      secretAccessKey: getConfig('aws').comprehend.secretAccessKey
    });
  }

  public async validatePhotoFile(
    file: FileDto,
    isPublic = false
  ) {
    if (!file.isImage()) {
      await this.fileService.remove(file._id);
      throw new HttpException('Invalid photo file', 422);
    }
    await this.fileService.queueProcessPhoto(file._id, {
      thumbnailSize: !isPublic ? getConfig('image').blurThumbnail : getConfig('image').originThumbnail
    });
  }

  public async validateVideoFile(video: FileDto): Promise<any> {
    if (!video.isVideo()) {
      await this.fileService.remove(video._id);
      throw new HttpException('Invalid video file', 422);
    }
    await this.fileService.queueProcessVideo(video._id, {
      count: 1
    });
    return true;
  }

  public async createPrivateMessage(
    conversationId: string | Types.ObjectId,
    payload: MessageCreatePayload,
    sender: IRecipient,
    jwToken: string
  ) {
    const conversation = await this.conversationService.findById(
      conversationId
    );
    if (!conversation) {
      throw new EntityNotFoundException();
    }
    const found = conversation.recipients.find(
      (recipient) => recipient.sourceId.toString() === sender.sourceId.toString()
    );
    if (!found) {
      throw new EntityNotFoundException();
    }
    const message = await this.messageModel.create({
      ...payload,
      senderId: sender.sourceId,
      senderSource: sender.source,
      conversationId: conversation._id
    });
    if (message.fileIds && message.fileIds.length) {
      message.fileIds.map((fileId) => this.fileService.addRef((fileId as any), {
        itemId: message._id,
        itemType: REF_TYPE.MESSAGE
      }));
    }
    const files = message.fileIds ? await this.fileService.findByIds(message.fileIds) : [];
    const dto = new MessageDto(message);
    dto.files = files && files.length > 0 && files.map((file) => {
      // track server s3 or local, assign jwToken if local
      let fileUrl = file.getUrl(true);
      if (file.server !== Storage.S3) {
        fileUrl = `${file.getUrl()}?messageId=${message._id}&token=${jwToken}`;
      }
      return {
        ...file.toResponse(),
        thumbnails: file.getThumbnails(),
        url: fileUrl
      };
    });

    await this.queueEventService.publish({
      channel: MESSAGE_CHANNEL,
      eventName: MESSAGE_EVENT.CREATED,
      data: dto
    });
    return dto;
  }

  public async loadPrivateMessages(req: MessageListRequest, user: UserDto, jwToken: string) {
    const conversation = await this.conversationService.findById(
      req.conversationId
    );
    if (!conversation) {
      throw new EntityNotFoundException();
    }

    const found = conversation.recipients.find(
      (recipient) => recipient.sourceId.toString() === user._id.toString()
    );

    if (!found) {
      throw new EntityNotFoundException();
    }

    const query = { conversationId: conversation._id } as any;
    const [data, total] = await Promise.all([
      this.messageModel
        .find(query)
        .sort({ createdAt: -1 })
        .lean()
        .limit(req.limit)
        .skip(req.offset),
      this.messageModel.countDocuments(query)
    ]);

    const fileIds = uniq(flatten(data.map((d) => d?.fileIds)));
    const files = fileIds && await this.fileService.findByIds(fileIds);
    const messages = data.map((m) => new MessageDto(m));
    messages.forEach((m) => {
      if (m?.fileIds && m.fileIds?.length > 0 && files && files.length > 0) {
        const _files = files.filter((f) => (`${m.fileIds}`).includes(`${f._id}`));
        // eslint-disable-next-line no-param-reassign
        m.files = _files.map((file) => {
          let fileUrl = file.getUrl(true);
          // track server s3 or local, assign jwtoken if local
          if (file.server !== Storage.S3) {
            fileUrl = `${file.getUrl()}?messageId=${m._id}&token=${jwToken}`;
          }
          return {
            ...file.toResponse(),
            thumbnails: file.getThumbnails(),
            url: fileUrl
          };
        });
      }
    });

    return {
      data: messages,
      total
    };
  }

  public async deleteMessage(messageId: string, user: UserDto) {
    const message = await this.messageModel.findById(messageId);
    if (!message) {
      throw new EntityNotFoundException();
    }
    if (
      user.roles &&
      !user.roles.includes('admin') &&
      message.senderId.toString() !== user._id.toString()
    ) {
      throw new ForbiddenException();
    }
    if (message.conversationId) {
      const conversation = await this.conversationService.findById(message.conversationId);
      const channel = (conversation.type === CONVERSATION_TYPE.PRIVATE) ? MESSAGE_CHANNEL : MESSAGE_PRIVATE_STREAM_CHANNEL;
      const data = (conversation.type === CONVERSATION_TYPE.PRIVATE) ? message : { message, conversation };
      await Promise.all([
        this.queueEventService.publish({
          channel,
          eventName: MESSAGE_EVENT.DELETED,
          data
        }),
        this.queueEventService.publish({
          channel: DELETE_MESSAGE_CHANNEL,
          eventName: MESSAGE_EVENT.DELETED,
          data: {
            messageId: message._id
          }
        })
      ]);
    }
    return message;
  }

  // stream message
  public async loadPublicMessages(req: MessageListRequest) {
    const conversation = await this.conversationService.findById(
      req.conversationId
    );
    if (!conversation) {
      throw new EntityNotFoundException();
    }

    const query = { conversationId: conversation._id };
    const [data, total] = await Promise.all([
      this.messageModel
        .find(query)
        .sort({ createdAt: -1 })
        .lean()
        .limit(req.limit)
        .skip(req.offset),
      this.messageModel.countDocuments(query)
    ]);

    const senderIds = data.map((d) => d.senderId);
    const [users, performers] = await Promise.all([
      senderIds.length ? this.userService.findByIds(senderIds) : [],
      senderIds.length ? this.performerService.findByIds(senderIds) : []
    ]);

    const messages = data.map((message) => {
      let user = null;
      user = users.find((u) => u._id.toString() === message.senderId.toString());
      if (!user) {
        user = performers.find(
          (p) => p._id.toString() === message.senderId.toString()
        );
      }

      return {
        ...message,
        senderInfo: user ? new UserDto(user).toResponse() : new PerformerDto(user).toResponse()
      };
    });

    return {
      data: messages.map((m) => new MessageDto(m)),
      total
    };
  }

  public async createStreamMessageFromConversation(
    conversationId: string,
    payload: MessageCreatePayload,
    sender: IRecipient,
    user: UserDto
  ) {
    const conversation = await this.conversationService.findById(
      conversationId
    );
    if (!conversation) {
      throw new EntityNotFoundException();
    }
    const message = await this.messageModel.create({
      ...payload,
      senderId: sender.sourceId,
      senderSource: sender.source,
      conversationId: conversation._id
    });
    const dto = new MessageDto(message);
    dto.senderInfo = user;
    await this.queueEventService.publish({
      channel: MESSAGE_PRIVATE_STREAM_CHANNEL,
      eventName: MESSAGE_EVENT.CREATED,
      data: { message: dto, conversation }
    });
    return dto;
  }

  public async deleteAllMessageInConversation(
    conversationId: string,
    user: any
  ) {
    const conversation = await this.conversationService.findById(
      conversationId
    );
    if (!conversation) {
      throw new EntityNotFoundException();
    }
    if (
      conversation.performerId.toString() !== user._id.toString()
    ) {
      throw new ForbiddenException();
    }

    await this.messageModel.deleteMany({ conversationId: conversation._id });
    return { success: true };
  }

  public async detectToxicity(conversationId: string) {
    // Query the previous 10 messages in the conversation
    const previousMessages = await this.messageModel.find({
      conversationId
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get message IDs from the previous messages
    const previousMessageIds = previousMessages.map((prevMsg) => prevMsg._id);

    // Query the toxicityReports collection for existing reports
    const existingReports = await this.toxicityReportModel.find({
      messageId: { $in: previousMessageIds }
    }).lean();

    // Get the IDs of messages that have already been analyzed
    const reportedMessageIds = new Set(existingReports.map((report) => report.messageId.toString()));

    // Filter out messages that have already been analyzed
    const unprocessedMessages = previousMessages.filter(
      (prevMsg) => !reportedMessageIds.has(prevMsg._id.toString())
    );

    // If there are no unprocessed messages, exit early
    if (unprocessedMessages.length === 0) {
      console.log('No new messages to analyze for toxicity.');
      return;
    }

    // Prepare params for Amazon Comprehend's detectToxicContent
    const params = {
      LanguageCode: 'en',
      TextSegments: unprocessedMessages.map((msg) => ({
        Text: msg.text
      }))
    };

    console.log('Toxicity params:', params);

    // Call Amazon Comprehend to detect toxicity
    this.comprehend.detectToxicContent(params, async (err, data) => {
      if (err) {
        console.log('Error detecting toxicity:', err);
      } else {
        console.log('Toxicity detected:', data.ResultList);

        // Iterate through the results and save them to the toxicityReports collection
        const toxicityReports = data.ResultList.map(async (result, i) => {
          const correspondingMessage = unprocessedMessages[i];

          // Check if toxicity scores exist and save the report if they do
          if (result.Labels && result.Labels.length > 0) {
            const report = {
              messageId: correspondingMessage._id,
              detectedLabels: result.Labels.map((score) => ({
                label: score.Name,
                score: score.Score
              })),
              toxicity: result.Toxicity
            };

            try {
              await this.toxicityReportModel.create(report);
              console.log(`Toxicity report saved for message ID: ${correspondingMessage._id}`);
            } catch (saveError) {
              console.error(`Error saving toxicity report for message ID: ${correspondingMessage._id}`, saveError);
            }
          }
          return Promise.resolve();
        });

        await Promise.all(toxicityReports);
      }
    });
  }

  public async createKeyword(keyword: string): Promise<void> {
    if (!keyword) {
      throw new Error('Keyword is required');
    }

    const existingKeyword = await this.keywordModel.findOne({ keyword });
    if (existingKeyword) {
      throw new Error('Keyword already exists');
    }

    await this.keywordModel.create({ keyword });
  }

  public async getToxicityReportsByUser(userId: string, limit: number, offset: number) {
    try {
      const reports = await this.toxicityReportModel.aggregate([
      // Stage 1: Join with the messages collection to get message details
        {
          $lookup: {
            from: 'messages', // The name of the messages collection
            localField: 'messageId',
            foreignField: '_id',
            as: 'messageDetails'
          }
        },
        // Stage 2: Unwind the messageDetails array to simplify the structure
        {
          $unwind: '$messageDetails'
        },
        // Stage 3: Filter the results by senderId (user ID)
        {
          $match: {
            'messageDetails.senderId': new Types.ObjectId(userId)
          }
        },
        // Stage 4: Project only necessary fields
        {
          $project: {
            messageId: 1,
            detectedLabels: 1,
            createdAt: 1,
            updatedAt: 1,
            'messageDetails.text': 1,
            'messageDetails.createdAt': 1
          }
        },
        // Stage 5: Pagination
        {
          $skip: offset
        },
        {
          $limit: limit
        }
      ]);

      return reports;
    } catch (error) {
      console.error('Error getting toxicity reports:', error);
      return [];
    }
  }
}
