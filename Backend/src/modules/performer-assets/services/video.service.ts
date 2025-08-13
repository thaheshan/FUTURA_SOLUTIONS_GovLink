import { Injectable, Inject, forwardRef, HttpException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
    QueueEventService,
    QueueEvent,
    EntityNotFoundException,
    ForbiddenException,
    StringHelper
} from 'src/kernel';
import { FileDto } from 'src/modules/file';
import { FileService, FILE_EVENT } from 'src/modules/file/services';
import { ReactionService } from 'src/modules/reaction/services/reaction.service';
import { PerformerService } from 'src/modules/performer/services';
import { merge } from 'lodash';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { TokenTransactionService } from 'src/modules/token-transaction/services';
import { PurchaseItemType } from 'src/modules/token-transaction/constants';
import { EVENT } from 'src/kernel/constants';
import { REF_TYPE } from 'src/modules/file/constants';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserDto } from 'src/modules/user/dtos';
import { isObjectId } from 'src/kernel/helpers/string.helper';
import { REACTION, REACTION_TYPE } from 'src/modules/reaction/constants';
import { Storage } from 'src/modules/storage/contants';
import * as moment from 'moment';
import { VideoUpdatePayload } from '../payloads';
import { VideoDto, IVideoResponse } from '../dtos';
import { DELETED_ASSETS_CHANNEL, VIDEO_STATUS } from '../constants';
import { VideoCreatePayload } from '../payloads/video-create.payload';
import { VideoModel } from '../models';
import { PERFORMER_VIDEO_MODEL_PROVIDER } from '../providers';

export const PERFORMER_VIDEO_CHANNEL = 'PERFORMER_VIDEO_CHANNEL';
export const CONVERT_VIDEO_CHANNEL = 'CONVERT_VIDEO_CHANNEL';
export const CONVERT_TEASER_CHANNEL = 'CONVERT_TEASER_CHANNEL';
export const PERFORMER_COUNT_VIDEO_CHANNEL = 'PERFORMER_COUNT_VIDEO_CHANNEL';
const FILE_PROCESSED_TOPIC = 'FILE_PROCESSED';
const TEASER_PROCESSED_TOPIC = 'TEASER_PROCESSED_TOPIC';

interface VideoServiceData extends QueueEvent {
    data: {
        fileId: string;
        meta: {
            videoId: string;
        };
    };
}
@Injectable()
export class VideoService {
    constructor(
        @Inject(forwardRef(() => PerformerService))
        private readonly performerService: PerformerService,
        @Inject(forwardRef(() => ReactionService))
        private readonly reactionService: ReactionService,
        @Inject(forwardRef(() => TokenTransactionService))
        private readonly tokenTransactionService: TokenTransactionService,
        @Inject(forwardRef(() => SubscriptionService))
        private readonly subscriptionService: SubscriptionService,
        @Inject(PERFORMER_VIDEO_MODEL_PROVIDER)
        private readonly PerformerVideoModel: Model<VideoModel>,
        private readonly queueEventService: QueueEventService,
        private readonly fileService: FileService
    ) {
        this.queueEventService.subscribe(
            CONVERT_TEASER_CHANNEL,
            TEASER_PROCESSED_TOPIC,
            this.handleTeaserProcessed.bind(this)
        );
        this.queueEventService.subscribe(
            CONVERT_VIDEO_CHANNEL,
            FILE_PROCESSED_TOPIC,
            this.handleFileProcessed.bind(this)
        );
    }

    public async find(query) {
        return this.PerformerVideoModel.find(query);
    }

    public async findById(id: string | Types.ObjectId) {
        const video = await this.PerformerVideoModel.findById(id);
        return new VideoDto(video);
    }

    public async findByIds(ids: string[] | Types.ObjectId[]) {
        const videos = await this.PerformerVideoModel.find({
            _id: { $in: ids }
        });
        return videos;
    }

    public getVideoForView(
        file: FileDto,
        video: VideoDto,
        canView: boolean,
        jwToken: string
    ) {
        let fileUrl = file.getUrl(canView);
        if (file.server !== Storage.S3) {
            fileUrl = `${fileUrl}?videoId=${video._id}&token=${jwToken}`;
        }
        return {
            _id: file._id,
            name: file.name,
            url: fileUrl,
            duration: file.duration,
            thumbnails: file.getThumbnails()
        };
    }

    public async handleTeaserProcessed(event: VideoServiceData) {
        const { eventName, data } = event;
        if (eventName !== FILE_EVENT.VIDEO_PROCESSED) {
            return;
        }

        const { videoId } = data.meta;
        const [video] = await Promise.all([
            this.PerformerVideoModel.findById(videoId)
        ]);
        if (!video) {
            await this.fileService.remove(data.fileId);
            // TODO - delete file?
            return;
        }
        video.teaserProcessing = false;
        await video.save();
    }

    public async handleFileProcessed(event: VideoServiceData) {
        const { eventName } = event;
        if (eventName !== FILE_EVENT.VIDEO_PROCESSED) {
            return;
        }

        const { videoId } = event.data.meta;
        const [video, file] = await Promise.all([
            this.PerformerVideoModel.findById(videoId),

            this.fileService.findById(event.data.fileId)
        ]);
        if (!video) {
            // TODO - delete file?

            await this.fileService.remove(event.data.fileId);
            return;
        }

        const oldStatus = video.status;
        video.processing = false;
        if (file.status === 'error') {
            video.status = VIDEO_STATUS.FILE_ERROR;
        }
        await video.save();

        // update new status?
        await this.queueEventService.publish(
            new QueueEvent({
                channel: PERFORMER_COUNT_VIDEO_CHANNEL,
                eventName: EVENT.UPDATED,
                data: {
                    ...new VideoDto(video),
                    oldStatus
                }
            })
        );
    }

    public async create(
        video: FileDto,
        teaser: FileDto,
        thumbnail: FileDto,
        payload: VideoCreatePayload,
        creator?: UserDto
    ): Promise<VideoDto> {
        let valid = true;
        if (!video) valid = false;

        if (!valid && thumbnail) {
            await this.fileService.remove(thumbnail._id);
        }

        if (!valid && teaser) {
            await this.fileService.remove(teaser._id);
        }

        if (thumbnail && !thumbnail.isImage()) {
            await this.fileService.remove(thumbnail._id);
        }

        if (video && !video.mimeType.toLowerCase().includes('video')) {
            await this.fileService.remove(video._id);
        }

        if (teaser && !teaser.mimeType.toLowerCase().includes('video')) {
            await this.fileService.remove(teaser._id);
        }

        if (!valid) {
            throw new HttpException('Invalid file format', 400);
        }
        const model = new this.PerformerVideoModel(payload);
        model.fileId = video._id;
        if (!model.performerId && creator) {
            model.performerId = creator._id;
        }
        model.thumbnailId = thumbnail ? thumbnail._id : null;
        if (teaser) {
            model.teaserId = teaser._id;
            model.teaserProcessing = true;
        }
        model.processing = true;
        model.slug = StringHelper.createAlias(payload.title);
        const slugCheck = await this.PerformerVideoModel.countDocuments({
            slug: model.slug
        });
        if (slugCheck) {
            model.slug = `${model.slug}-${StringHelper.randomString(8)}`;
        }
        creator && model.set('createdBy', creator._id);
        model.createdAt = new Date();
        model.updatedAt = new Date();
        await model.save();
        await Promise.all([
            model.thumbnailId &&
                this.fileService.addRef(model.thumbnailId, {
                    itemId: model._id,
                    itemType: REF_TYPE.VIDEO
                }),
            model.teaserId &&
                this.fileService.addRef(model.teaserId, {
                    itemId: model._id,
                    itemType: REF_TYPE.VIDEO
                }),
            model.fileId &&
                this.fileService.addRef(model.fileId, {
                    itemType: REF_TYPE.VIDEO,
                    itemId: model._id
                })
        ]);
        if (model.status === VIDEO_STATUS.ACTIVE) {
            await this.queueEventService.publish(
                new QueueEvent({
                    channel: PERFORMER_COUNT_VIDEO_CHANNEL,
                    eventName: EVENT.CREATED,
                    data: new VideoDto(model)
                })
            );
        }
        // covert video file
        await this.fileService.queueProcessVideo(model.fileId, {
            publishChannel: CONVERT_VIDEO_CHANNEL,
            meta: {
                videoId: model._id
            }
        });
        // convert teaser file
        model.teaserId &&
            (await this.fileService.queueProcessVideo(model.teaserId, {
                publishChannel: CONVERT_TEASER_CHANNEL,
                meta: {
                    videoId: model._id
                }
            }));

        return new VideoDto(model);
    }

    public async getDetails(
        videoId: string,
        jwToken: string
    ): Promise<VideoDto> {
        const video = await this.PerformerVideoModel.findById(videoId);
        if (!video) throw new EntityNotFoundException();
        const participantIds = video.participantIds.filter((p) =>
            StringHelper.isObjectId(p)
        );
        const [performer, videoFile, thumbnailFile, teaserFile, participants] =
            await Promise.all([
                this.performerService.findById(video.performerId),
                this.fileService.findById(video.fileId),
                video.thumbnailId ?
                    this.fileService.findById(video.thumbnailId) :
                    null,
                video.teaserId ?
                    this.fileService.findById(video.teaserId) :
                    null,
                video.participantIds.length ?
                    await this.performerService.findByIds(participantIds) :
                    []
            ]);

        // TODO - define interface or dto?
        const dto = new VideoDto(video);
        dto.thumbnail = thumbnailFile && {
            name: thumbnailFile.name,
            url: thumbnailFile.getUrl(),
            thumbnails: thumbnailFile.getThumbnails()
        };
        dto.teaser =
            teaserFile && this.getVideoForView(teaserFile, dto, true, jwToken);
        dto.video = this.getVideoForView(videoFile, dto, true, jwToken);
        dto.performer = performer ?
            new PerformerDto(performer).toSearchResponse() :
            null;
        dto.participants = participants.map((p) => p.toSearchResponse());
        return dto;
    }

    public async userGetDetails(
        videoId: string,
        currentUser: UserDto,
        jwToken: string
    ): Promise<VideoDto> {
        const query = isObjectId(videoId) ?
            { _id: videoId } :
            { slug: videoId };
        const video = await this.PerformerVideoModel.findOne(query);
        if (!video) throw new EntityNotFoundException();
        const participantIds = video.participantIds.filter((p) =>
            StringHelper.isObjectId(p)
        );
        const fileIds = [video.fileId];
        video.teaserId && fileIds.push(video.teaserId);
        video.thumbnailId && fileIds.push(video.thumbnailId);
        const [performer, files, participants, reactions] = await Promise.all([
            this.performerService.findById(video.performerId),
            this.fileService.findByIds(fileIds),
            video.participantIds.length ?
                await this.performerService.findByIds(participantIds) :
                [],
            this.reactionService.findByQuery({
                objectType: REACTION_TYPE.VIDEO,
                objectId: video._id,
                createdBy: currentUser?._id
            })
        ]);

        // TODO - define interface or dto?
        const dto = new IVideoResponse(video);
        const thumbnailFile = files.find(
            (f) => `${f._id}` === `${dto.thumbnailId}`
        );
        const teaserFile = files.find((f) => `${f._id}` === `${dto.teaserId}`);
        const videoFile = files.find((f) => `${f._id}` === `${dto.fileId}`);
        dto.isLiked = !!reactions.filter((r) => r.action === REACTION.LIKE)
            .length;
        dto.isBookmarked = !!reactions.filter(
            (r) => r.action === REACTION.BOOKMARK
        ).length;
        dto.performer = performer ?
            new PerformerDto(performer).toPublicDetailsResponse() :
            null;
        // TODO check video for sale or subscriber
        if (!dto.isSale) {
            const subscription =
                currentUser &&
                (await this.subscriptionService.findOneSubscription({
                    performerId: dto.performerId,
                    userId: currentUser._id
                }));
            dto.isSubscribed =
                (subscription && moment().isBefore(subscription.expiredAt)) ||
                false;
            if (subscription && subscription.usedFreeSubscription) {
                dto.performer.isFreeSubscription = false;
            }
        }
        if (dto.isSale) {
            const bought =
                currentUser &&
                (await this.tokenTransactionService.checkBought(
                    dto,
                    PurchaseItemType.VIDEO,
                    currentUser
                ));
            dto.isBought = bought;
        }
        if (
            (currentUser &&
                currentUser.roles &&
                currentUser.roles.includes('admin')) ||
            (currentUser && `${currentUser._id}` === `${dto.performerId}`)
        ) {
            dto.isBought = true;
            dto.isSubscribed = true;
        }
        let canView =
            (!dto.isSale && dto.isSubscribed) || (dto.isSale && dto.isBought);
        if (
            video.isSchedule &&
            moment(video.scheduledAt).isBefore(new Date())
        ) {
            canView = false;
        }
        dto.thumbnail = thumbnailFile && {
            url: thumbnailFile.getUrl(),
            thumbnails: thumbnailFile.getThumbnails()
        };
        dto.teaser =
            teaserFile && this.getVideoForView(teaserFile, dto, true, jwToken);
        dto.video = this.getVideoForView(videoFile, dto, canView, jwToken);
        dto.participants = participants.map((p) => p.toPublicDetailsResponse());
        await this.increaseView(dto._id);
        return dto;
    }

    public async updateInfo(
        id: string | Types.ObjectId,
        payload: VideoUpdatePayload,
        files: any,
        updater: UserDto
    ): Promise<VideoDto> {
        const {
            video: videoFile,
            thumbnail: thumbnailFile,
            teaser: teaserFile
        } = files;
        const video = await this.PerformerVideoModel.findById(id);
        if (!video) {
            throw new EntityNotFoundException();
        }
        const { fileId, thumbnailId, teaserId } = video;
        if (videoFile && videoFile._id) {
            video.fileId = videoFile._id;
        }
        if (thumbnailFile && thumbnailFile._id) {
            video.thumbnailId = thumbnailFile._id;
        }
        if (teaserFile && teaserFile._id) {
            video.teaserId = teaserFile._id;
        }
        if (
            videoFile &&
            !videoFile?.mimeType?.toLowerCase().includes('video')
        ) {
            await this.fileService.remove(videoFile._id);
            delete video.fileId;
        }
        if (thumbnailFile && !thumbnailFile.isImage()) {
            await this.fileService.remove(thumbnailFile._id);
            delete video.thumbnailId;
        }
        if (
            teaserFile &&
            !teaserFile.mimeType.toLowerCase().includes('video')
        ) {
            await this.fileService.remove(teaserFile._id);
            delete video.teaserId;
        }
        const oldStatus = video.status;
        let { slug } = video;
        if (payload.title !== video.title) {
            slug = StringHelper.createAlias(payload.title);
            const slugCheck = await this.PerformerVideoModel.countDocuments({
                slug,
                _id: { $ne: video._id }
            });
            if (slugCheck) {
                slug = `${slug}-${StringHelper.randomString(8)}`;
            }
        }
        merge(video, payload);
        if (
            video.status !== VIDEO_STATUS.FILE_ERROR &&
            payload.status !== VIDEO_STATUS.FILE_ERROR
        ) {
            video.status = payload.status;
        }
        if (payload.tags) {
            video.tags = payload.tags;
            video.markModified('tags');
        }
        if (payload.participantIds) {
            video.participantIds = payload.participantIds;
            video.markModified('participantIds');
        }
        updater && video.set('updatedBy', updater._id);
        video.updatedAt = new Date();
        video.slug = slug;
        await video.save();
        const dto = new VideoDto(video);
        if (thumbnailFile && `${video.thumbnailId}` !== `${thumbnailId}`) {
            await Promise.all([
                this.fileService.addRef(video.thumbnailId, {
                    itemId: video._id,
                    itemType: REF_TYPE.VIDEO
                }),
                thumbnailId && this.fileService.remove(thumbnailId)
            ]);
        }
        if (videoFile && `${video.fileId}` !== `${fileId}`) {
            // add ref, remove old file, convert file
            await Promise.all([
                this.fileService.addRef(video.fileId, {
                    itemId: video._id,
                    itemType: REF_TYPE.VIDEO
                }),
                fileId && this.fileService.remove(fileId),
                this.fileService.queueProcessVideo(video.fileId, {
                    publishChannel: CONVERT_VIDEO_CHANNEL,
                    meta: {
                        videoId: video._id
                    }
                })
            ]);
        }
        if (teaserFile && `${video.teaserId}` !== `${teaserId}`) {
            // add ref, remove old file, convert file
            await Promise.all([
                this.fileService.addRef(video.teaserId, {
                    itemId: video._id,
                    itemType: REF_TYPE.VIDEO
                }),
                teaserId && this.fileService.remove(teaserId),
                this.fileService.queueProcessVideo(video.teaserId, {
                    publishChannel: CONVERT_TEASER_CHANNEL,
                    meta: {
                        videoId: video._id
                    }
                })
            ]);
        }
        await this.queueEventService.publish(
            new QueueEvent({
                channel: PERFORMER_COUNT_VIDEO_CHANNEL,
                eventName: EVENT.UPDATED,
                data: {
                    ...dto,
                    oldStatus
                }
            })
        );

        return dto;
    }

    public async delete(id: string, user: UserDto) {
        const video = await this.PerformerVideoModel.findById(id);
        if (!video) {
            throw new EntityNotFoundException();
        }
        await this.PerformerVideoModel.deleteOne({ _id: video._id });
        video.fileId && (await this.fileService.remove(video.fileId));
        video.teaserId && (await this.fileService.remove(video.teaserId));
        video.thumbnailId && (await this.fileService.remove(video.fileId));
        await this.queueEventService.publish(
            new QueueEvent({
                channel: PERFORMER_COUNT_VIDEO_CHANNEL,
                eventName: EVENT.DELETED,
                data: { ...new VideoDto(video), user }
            })
        );
        await this.queueEventService.publish(
            new QueueEvent({
                channel: DELETED_ASSETS_CHANNEL,
                eventName: EVENT.DELETED,
                data: new VideoDto(video)
            })
        );
        return true;
    }

    public async deleteFile(id: string, type: string, user: UserDto) {
        const video = await this.PerformerVideoModel.findById(id);
        if (!video) {
            throw new EntityNotFoundException();
        }
        if (
            user.roles &&
            !user.roles.includes('admin') &&
            `${user._id}` !== `${video.performerId}`
        ) {
            throw new ForbiddenException();
        }
        if (type === 'teaser' && video.teaserId) {
            await this.fileService.remove(video.teaserId);
            await this.PerformerVideoModel.updateOne(
                { _id: video._id },
                { $unset: { teaserId: null } }
            );
        }
        if (type === 'thumbnail' && video.thumbnailId) {
            await this.fileService.remove(video.thumbnailId);
            await this.PerformerVideoModel.updateOne(
                { _id: video._id },
                { $unset: { thumbnailId: null } }
            );
        }
        return true;
    }

    public async increaseView(id: string | Types.ObjectId) {
        await this.PerformerVideoModel.updateOne(
            { _id: id },
            {
                $inc: { 'stats.views': 1 }
            }
        );
    }

    public async increaseComment(id: string | Types.ObjectId, num = 1) {
        await this.PerformerVideoModel.updateOne(
            { _id: id },
            {
                $inc: { 'stats.comments': num }
            }
        );
    }

    public async increaseLike(id: string | Types.ObjectId, num = 1) {
        await this.PerformerVideoModel.updateOne(
            { _id: id },
            {
                $inc: { 'stats.likes': num }
            }
        );
    }

    public async increaseFavourite(id: string | Types.ObjectId, num = 1) {
        await this.PerformerVideoModel.updateOne(
            { _id: id },
            {
                $inc: { 'stats.bookmarks': num }
            }
        );
    }

    public async checkAuth(req: any, user: UserDto) {
        const { query } = req;
        if (!query.videoId) {
            throw new ForbiddenException();
        }
        if (user.roles && user.roles.indexOf('admin') > -1) {
            return true;
        }
        const video = await this.PerformerVideoModel.findById(query.videoId);
        if (!video) throw new EntityNotFoundException();
        if (user._id.toString() === video.performerId.toString()) {
            return true;
        }

        // check schedule status
        if (
            video.isSchedule &&
            moment(video.scheduledAt).isBefore(new Date())
        ) {
            throw new ForbiddenException();
        }

        if (!video.isSale) {
            // check subscription
            const subscribed = await this.subscriptionService.checkSubscribed(
                video.performerId,
                user._id
            );
            if (!subscribed) {
                throw new ForbiddenException();
            }
            return true;
        }
        if (video.isSale) {
            // check bought
            const bought = await this.tokenTransactionService.checkBought(
                new VideoDto(video),
                PurchaseItemType.VIDEO,
                user
            );
            if (!bought) {
                throw new ForbiddenException();
            }
            return true;
        }
        throw new ForbiddenException();
    }
}
