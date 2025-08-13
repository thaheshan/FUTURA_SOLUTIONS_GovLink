import {
    Injectable,
    Inject,
    BadRequestException,
    forwardRef,
    NotFoundException
} from '@nestjs/common';
import { FileService } from 'src/modules/file/services';
import { Model, Types } from 'mongoose';
import { SpecialRequestPerformerPublishDto } from '../dtos';
import { SpecialRequestTypeDocument } from '../schema/special-request-type.schema';
import { SpecialRequestPerformerPageDocument } from '../schema/special-request-published-performer.schema';
import {
    SPECIAL_REQUEST_PERFORMER_PAGE_PROVIDER,
    SPECIAL_REQUEST_TYPE_MODEL_PROVIDER
} from '../providers';
import {
    SpecialRequestTypeAddPerfomerPayload,
    SpecialRequestPerformerPublishPagePayload
} from '../payloads';

@Injectable()
export class SpecialRequestPerfomerPublishService {
    constructor(
        @Inject(forwardRef(() => FileService))
        private readonly fileService: FileService,
        @Inject(SPECIAL_REQUEST_TYPE_MODEL_PROVIDER)
        private readonly specialRequestTypeModel: Model<SpecialRequestTypeDocument>,
        @Inject(SPECIAL_REQUEST_PERFORMER_PAGE_PROVIDER)
        private readonly specialRequestPulishPageModel: Model<SpecialRequestPerformerPageDocument>
    ) {}

    public async addSpecialRequestPerformerPage(
        payload: SpecialRequestTypeAddPerfomerPayload,
        creator: Types.ObjectId
    ): Promise<SpecialRequestPerformerPublishDto> {
        try {
            let addedRequest;
            if (payload._id) {
                addedRequest =
                    await this.specialRequestPulishPageModel.findByIdAndUpdate(
                        new Types.ObjectId(payload._id),
                        {
                            $push: {
                                specialRequestTypes: payload.specialRequestTypes
                            }
                        },
                        { new: true }
                    );
                return new SpecialRequestPerformerPublishDto(addedRequest);
            }
            addedRequest = await this.specialRequestPulishPageModel.create({
                ...payload,
                creator
            });
            return new SpecialRequestPerformerPublishDto(addedRequest);
        } catch (e) {
            console.error('Error in service:', e);
            throw e;
        }
    }

    public async updateSpecialRequestPage(
        payload: SpecialRequestTypeAddPerfomerPayload,
        creator: Types.ObjectId
    ): Promise<SpecialRequestPerformerPublishDto> {
        try {
            const res =
                await this.specialRequestPulishPageModel.findOneAndUpdate(
                    {
                        _id: new Types.ObjectId(payload._id),
                        creator,
                        'specialRequestTypes._id': new Types.ObjectId(
                            payload.specialRequestTypes[0]._id
                        )
                    },
                    {
                        $set: {
                            'specialRequestTypes.$.name':
                                payload.specialRequestTypes[0].name,
                            'specialRequestTypes.$.requestDescription':
                                payload.specialRequestTypes[0]
                                    .requestDescription,
                            'specialRequestTypes.$.enabled':
                                payload.specialRequestTypes[0].enabled,
                            'specialRequestTypes.$.basePrice':
                                payload.specialRequestTypes[0].basePrice,
                            'specialRequestTypes.$.highlights':
                                payload.specialRequestTypes[0].highlights
                        }
                    },
                    { new: true }
                );
            return new SpecialRequestPerformerPublishDto(res);
        } catch (e) {
            console.error('Error in service:', e);
            throw e;
        }
    }

    public async publishSpecialRequestPage(
        payload: SpecialRequestPerformerPublishPagePayload,
        creator: Types.ObjectId
    ): Promise<SpecialRequestPerformerPublishDto> {
        try {
            if (!creator) {
                throw new BadRequestException('Missing required fields');
            }
            let pageDet;
            if (payload._id) {
                pageDet =
                    await this.specialRequestPulishPageModel.findOneAndUpdate(
                        {
                            _id: new Types.ObjectId(payload._id),
                            creator
                        },
                        {
                            pageDescription: payload.pageDescription,
                            isPublished: payload.isPublished
                        },
                        { new: true }
                    );
                return new SpecialRequestPerformerPublishDto(pageDet);
            }
            pageDet = await this.specialRequestPulishPageModel.create({
                ...payload,
                creator
            });
            return new SpecialRequestPerformerPublishDto(pageDet);
        } catch (e) {
            console.error('Error in service:', e);
            throw e;
        }
    }

    public async uploadTeaserVideo(
        fileId: Types.ObjectId,
        creator: Types.ObjectId
    ): Promise<any> {
        try {
            const pageExists = await this.specialRequestPulishPageModel
                .findOne({ creator })
                .lean();
            if (!pageExists) {
                throw new NotFoundException(
                    'Special request page does not exist for this creator'
                );
            }
            if (pageExists.specialRequestTeaserVideo?.length > 3) {
                throw new BadRequestException(
                    'You can only upload a maximum of 3 teaser videos'
                );
            }
            const pageDet =
                await this.specialRequestPulishPageModel.findOneAndUpdate(
                    {
                        creator
                    },
                    {
                        $push: {
                            specialRequestTeaserVideo: { teaserVideo: fileId }
                        }
                    },
                    { new: true }
                );
            return new SpecialRequestPerformerPublishDto(pageDet);
        } catch (e) {
            console.error('Error in uploadTeaser:', e);
            throw e;
        }
    }

    public async getSpecialRequestPage(
        creator: Types.ObjectId
    ): Promise<SpecialRequestPerformerPublishDto | null> {
        try {
            const specialRequestPage = await this.specialRequestPulishPageModel
                .findOne({
                    creator
                })
                .lean();
            if (!specialRequestPage) return null;

            if (specialRequestPage.specialRequestTeaserVideo?.length > 0) {
                const teaserVideosWithUrls = await Promise.all(
                    specialRequestPage.specialRequestTeaserVideo.map(
                        async (data) => {
                            if (!data.teaserVideo) return data;
                            const teaserFile = await this.fileService.findById(
                                data.teaserVideo._id
                            );
                            return teaserFile
                                ? { ...data, url: teaserFile.getUrl() }
                                : data;
                        }
                    )
                );
                specialRequestPage.specialRequestTeaserVideo =
                    teaserVideosWithUrls;
            }
            const typeIds = (specialRequestPage.specialRequestTypes || [])
                .map((t) => t.specialRequestType)
                .filter((id) => !!id);
            const typeDocs = await this.specialRequestTypeModel
                .find({ _id: { $in: typeIds } })
                .lean();
            const typeIdToCategoryMap = new Map<string, Types.ObjectId>();
            typeDocs.forEach((doc) => {
                typeIdToCategoryMap.set(doc._id.toString(), doc.categoryId);
            });
            specialRequestPage.specialRequestTypes =
                specialRequestPage.specialRequestTypes.map((type) => {
                    const categoryId = type.specialRequestType
                        ? typeIdToCategoryMap.get(
                              type.specialRequestType.toString()
                          )
                        : null;
                    return {
                        ...type,
                        categoryId
                    };
                });
            return new SpecialRequestPerformerPublishDto(specialRequestPage);
        } catch (e) {
            console.error('Error in service:', e);
            throw e;
        }
    }

    public async getPerformersSpecialRequestPage(
        creator: string
    ): Promise<SpecialRequestPerformerPublishDto> {
        try {
            const specialRequestPage = await this.specialRequestPulishPageModel
                .findOne({
                    creatorId: new Types.ObjectId(creator)
                })
                .lean();
            if (!specialRequestPage) return null;

            if (specialRequestPage.specialRequestTeaserVideo?.length > 0) {
                const teaserVideosWithUrls = await Promise.all(
                    specialRequestPage.specialRequestTeaserVideo.map(
                        async (data) => {
                            if (!data.teaserVideo) return data;
                            const teaserFile = await this.fileService.findById(
                                data.teaserVideo._id
                            );
                            return teaserFile
                                ? { ...data, url: teaserFile.getUrl() }
                                : data;
                        }
                    )
                );
                specialRequestPage.specialRequestTeaserVideo =
                    teaserVideosWithUrls;
            }
            const typeIds = (specialRequestPage.specialRequestTypes || [])
                .map((t) => t.specialRequestType)
                .filter((id) => !!id);
            const typeDocs = await this.specialRequestTypeModel
                .find({ _id: { $in: typeIds } })
                .lean();
            const typeIdToCategoryMap = new Map<string, Types.ObjectId>();
            typeDocs.forEach((doc) => {
                typeIdToCategoryMap.set(doc._id.toString(), doc.categoryId);
            });
            specialRequestPage.specialRequestTypes =
                specialRequestPage.specialRequestTypes
                    .filter((type) => type.enabled)
                    .map((type) => {
                        const categoryId = type.specialRequestType
                            ? typeIdToCategoryMap.get(
                                  type.specialRequestType.toString()
                              )
                            : null;
                        return {
                            ...type,
                            categoryId
                        };
                    });
            return new SpecialRequestPerformerPublishDto(specialRequestPage);
        } catch (e) {
            console.error('Error in service:', e);
            throw e;
        }
    }
}
