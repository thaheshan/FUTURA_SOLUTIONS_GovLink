import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { FileService } from 'src/modules/file/services';
import { CreateCreatorPostDto } from '../dto/create-creator-post-v2.dto';
import { CreatorTextPostV2Payload } from '../payload/creator-text-post-v2.payload';
import { CreatorImagePostV2Payload } from '../payload/creator-image-post-v2.payload';
import { CreatorVideoPostV2Payload } from '../payload/creator-video-post-v2.payload';
import { CreatorPostV2Document } from '../schema/creator-post-v2.schema';
import { CREATOR_POST_MODEL } from '../providers';
import { PostTypeEnum } from '../constants';

@Injectable()
export class CreatorPostV2Service {
    private readonly logger = new Logger(CreatorPostV2Service.name);

    constructor(
        @Inject(forwardRef(() => FileService))
        private readonly fileService: FileService,
        @Inject(CREATOR_POST_MODEL)
        private creatorPostModel: Model<CreatorPostV2Document>
    ) {}

    async createTextPost(
        payload: Partial<CreatorTextPostV2Payload>,
        creator: Types.ObjectId
    ): Promise<CreateCreatorPostDto> {
        try {
            const res = await this.creatorPostModel.create({
                ...payload,
                creator,
                postType: PostTypeEnum.TEXT
            });
            return new CreateCreatorPostDto(res);
        } catch (e) {
            this.logger.error('Error in Create Text Post:', e);
            throw e;
        }
    }

    async createVideoPost(
        payload: Partial<CreatorVideoPostV2Payload>,
        creator: Types.ObjectId
    ): Promise<CreateCreatorPostDto> {
        try {
            const res = await this.creatorPostModel.create({
                ...payload,
                creator,
                postType: PostTypeEnum.VIDEO,
                video: new Types.ObjectId(payload.video)
            });
            return new CreateCreatorPostDto(res);
        } catch (e) {
            this.logger.error('Error in Create Video Post:', e);
            throw e;
        }
    }

    async createImagePost(
        payload: Partial<CreatorImagePostV2Payload>,
        creator: Types.ObjectId
    ): Promise<CreateCreatorPostDto> {
        try {
            const res = await this.creatorPostModel.create({
                ...payload,
                creator,
                postType: PostTypeEnum.IMAGE,
                image: new Types.ObjectId(payload.image)
            });
            return new CreateCreatorPostDto(res);
        } catch (e) {
            this.logger.error('Error in Create Image Post:', e);
            throw e;
        }
    }

    async getCreatorPosts(
        creator: Types.ObjectId
    ): Promise<CreateCreatorPostDto[]> {
        const res = await this.creatorPostModel.find({ creator }).lean();
        return Promise.all(
            res.map(async (data) => {
                const feed = new CreateCreatorPostDto(data);
                if (feed.image) {
                    const imageFile = await this.fileService.findById(
                        feed.image._id
                    );
                    feed.imageUrl = imageFile.getUrl();
                }
                if (feed.video) {
                    const videoFile = await this.fileService.findById(
                        feed.video._id
                    );
                    feed.imageUrl = videoFile.getUrl();
                }
                return feed;
            })
        );
    }
}
