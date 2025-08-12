/* eslint-disable no-param-reassign */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  EntityNotFoundException, ForbiddenException, QueueEventService, QueueEvent, PageableData
} from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { PerformerDto } from 'src/modules/performer/dtos';
import { ReactionService } from 'src/modules/reaction/services/reaction.service';
import { FeedService } from 'src/modules/feed/services';
import { MailerService } from 'src/modules/mailer';
import { VideoService } from 'src/modules/performer-assets/services';
import { CommentModel } from '../models/comment.model';
import { COMMENT_MODEL_PROVIDER } from '../providers/comment.provider';
import {
  CommentCreatePayload, CommentEditPayload, CommentSearchRequestPayload
} from '../payloads';
import { UserDto } from '../../user/dtos';
import { CommentDto } from '../dtos/comment.dto';
import { UserService } from '../../user/services';
import { PerformerService } from '../../performer/services';
import { COMMENT_CHANNEL, OBJECT_TYPE } from '../contants';

@Injectable()
export class CommentService {
  constructor(
    @Inject(forwardRef(() => VideoService))
    private readonly videoService: VideoService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => FeedService))
    private readonly feedService: FeedService,
    @Inject(COMMENT_MODEL_PROVIDER)
    private readonly commentModel: Model<CommentModel>,
    private readonly queueEventService: QueueEventService,
    private readonly reactionService: ReactionService,
    private readonly mailerService: MailerService
  ) { }

  public async increaseComment(commentId, num = 1) {
    await this.commentModel.updateOne({ _id: commentId }, { $inc: { totalReply: num } });
  }

  public async create(
    data: CommentCreatePayload,
    user: UserDto
  ): Promise<CommentDto> {
    const comment = { ...data } as any;
    comment.createdBy = user._id;
    comment.createdAt = new Date();
    comment.updatedAt = new Date();

    let resp;
    let link = '#';
    switch (comment.objectType) {
      case OBJECT_TYPE.FEED:
        // eslint-disable-next-line no-case-declarations
        resp = await this.feedService.findById(comment.objectId);
        comment.recipientId = resp.fromSourceId;
        link = `${process.env.USER_URL}/post/${comment.objectId}`;
        break;
      case OBJECT_TYPE.VIDEO:
        // eslint-disable-next-line no-case-declarations
        resp = await this.videoService.findById(comment.objectId);
        comment.recipientId = resp.performerId;
        link = `${process.env.USER_URL}/video/${comment.objectId}`;
        break;
      case OBJECT_TYPE.COMMENT:
        // eslint-disable-next-line no-case-declarations
        resp = await this.findById(comment.objectId);
        comment.recipientId = resp.recipientId;
        break;
      default:
        break;
    }

    const newComment = await this.commentModel.create(comment);
    await this.queueEventService.publish(
      new QueueEvent({
        channel: COMMENT_CHANNEL,
        eventName: EVENT.CREATED,
        data: new CommentDto(newComment)
      })
    );
    const [performerInfo, userInfo, performer] = await Promise.all([
      this.performerService.findById(user._id),
      this.userService.findById(user._id),
      comment.recipientId && this.performerService.findById(comment.recipientId)
    ]);

    performer?.email && await this.mailerService.send({
      subject: 'New comment',
      to: performer?.email,
      data: {
        contentType: comment.objectType,
        userName: user?.name || user?.username,
        link
      },
      template: 'performer-comment-content'
    });

    const returnData = new CommentDto(newComment);
    // eslint-disable-next-line no-nested-ternary
    returnData.creator = (userInfo && new UserDto(userInfo).toResponse()) || (performerInfo && new PerformerDto(performerInfo).toResponse());
    return returnData;
  }

  public async findById(id) {
    const data = await this.commentModel.findById(id);
    return data;
  }

  public async update(
    id: string | Types.ObjectId,
    payload: CommentEditPayload,
    user: UserDto
  ): Promise<any> {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new EntityNotFoundException();
    }
    const data = { ...payload };
    if (comment.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException();
    }
    await this.commentModel.updateOne({ _id: id }, data);
    return { updated: true };
  }

  public async delete(
    id: string | Types.ObjectId,
    user: UserDto
  ) {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new EntityNotFoundException();
    }
    if (!user.isPerformer && (comment.createdBy.toString() !== user._id.toString())) {
      throw new ForbiddenException();
    }
    await this.commentModel.deleteOne({ _id: id });
    await this.queueEventService.publish(
      new QueueEvent({
        channel: COMMENT_CHANNEL,
        eventName: EVENT.DELETED,
        data: new CommentDto(comment)
      })
    );
    return comment;
  }

  public async findByIds(ids: any[]): Promise<CommentDto[]> {
    const users = await this.commentModel
      .find({ _id: { $in: ids } })
      .lean()
      .exec();
    return users.map((u) => new CommentDto(u));
  }

  public async search(
    req: CommentSearchRequestPayload,
    user: UserDto
  ): Promise<PageableData<CommentDto>> {
    const query = {} as any;
    if (req.objectId) {
      query.objectId = req.objectId;
    }
    const sort = {
      createdAt: -1
    } as any;
    const [data, total] = await Promise.all([
      this.commentModel
        .find(query)
        .sort(sort)
        .limit(req.limit)
        .skip(req.offset),
      this.commentModel.countDocuments(query)
    ]);
    const comments = data.map((d) => new CommentDto(d));
    const commentIds = data.map((d) => d._id);

    const UIds = data.map((d) => d.createdBy);
    const [users, performers, reactions] = await Promise.all([
      UIds.length ? this.userService.findByIds(UIds) : [],
      UIds.length ? this.performerService.findByIds(UIds) : [],
      user && commentIds.length ? this.reactionService.findByQuery({ objectId: { $in: commentIds }, createdBy: user._id }) : []
    ]);
    comments.forEach((comment: CommentDto) => {
      const performer = performers.find((p) => p._id.toString() === comment.createdBy.toString());
      const userComment = users.find((u) => u._id.toString() === comment.createdBy.toString());
      const liked = reactions.find((reaction) => reaction.objectId.toString() === comment._id.toString());
      // eslint-disable-next-line no-nested-ternary
      comment.creator = performer ?
        new PerformerDto(performer).toSearchResponse() :
        (userComment ? new UserDto(userComment).toResponse() : null);
      comment.isLiked = !!liked;
      comment.isAuth = `${user._id}` === `${comment.recipientId}` || `${user._id}` === `${comment.createdBy}`;
    });

    return {
      data: comments,
      total
    };
  }
}
