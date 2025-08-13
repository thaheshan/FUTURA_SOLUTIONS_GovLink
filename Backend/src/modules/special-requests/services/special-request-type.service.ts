import {
    Injectable,
    Inject,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
    SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER,
    SPECIAL_REQUEST_TYPE_MODEL_PROVIDER
} from '../providers';
import { SpecialRequestTypeModel } from '../models/special-request-type.model';
import { SpecialRequestTypeDto } from '../dtos';
import { SpecialRequestTypeCreatePayload } from '../payloads/special-request-type-create.request';
import { SpecialRequestTypeCategoryModel } from '../models/special-request-type-category.model';

@Injectable()
export class SpecialRequestTypeService {
    constructor(
        @Inject(SPECIAL_REQUEST_TYPE_MODEL_PROVIDER)
        private readonly specialRequestTypeModel: Model<SpecialRequestTypeModel>,
        @Inject(SPECIAL_REQUEST_TYPE_CATEGORY_MODEL_PROVIDER)
        private readonly specialRequestTypeCategoryModel: Model<SpecialRequestTypeCategoryModel>
    ) {}

    public async syncSpecialRequestTypes() {
        const SPECIAL_REQUEST_TYPE_CATEGORIES = [
            {
                name: 'Personal celebrations',
                code: 'PERSONAL_CELEBRATIONS',
                description: ''
            },
            {
                name: 'Email participation',
                code: 'EMAIL_PARTICIPATION',
                description: ''
            },
            {
                name: 'Promotions & media',
                code: 'PROMOTIONS_MEDIA',
                description: ''
            },
            {
                name: 'Engagements & interaction',
                code: 'ENGAGEMENTS_INTERACTION',
                description: ''
            },
            {
                name: 'Fundraising & other requirements',
                code: 'FUNDRAISING_OTHER',
                description: ''
            }
        ];

        const SPECIAL_REQUEST_TYPES = [
            {
                name: 'Birthday greeting',
                category: 'PERSONAL_CELEBRATIONS',
                description: ''
            },
            {
                name: 'Birthday appearance',
                category: 'PERSONAL_CELEBRATIONS',
                description: ''
            },
            {
                name: 'Record a video message',
                category: 'PERSONAL_CELEBRATIONS',
                description: ''
            },
            {
                name: 'Attend an event',
                category: 'PERSONAL_CELEBRATIONS',
                description: ''
            },
            {
                name: 'Message for a specific person',
                category: 'PERSONAL_CELEBRATIONS',
                description: ''
            },

            {
                name: 'Deliver speech',
                category: 'EMAIL_PARTICIPATION',
                description: ''
            },
            {
                name: 'Team announcement',
                category: 'EMAIL_PARTICIPATION',
                description: ''
            },
            {
                name: 'Guest speaking',
                category: 'EMAIL_PARTICIPATION',
                description: ''
            },
            {
                name: 'Panel appearances',
                category: 'EMAIL_PARTICIPATION',
                description: ''
            },
            {
                name: 'MC appearances',
                category: 'EMAIL_PARTICIPATION',
                description: ''
            },
            {
                name: 'Guest appearances',
                category: 'EMAIL_PARTICIPATION',
                description: ''
            },

            {
                name: 'Club or event promotion',
                category: 'PROMOTIONS_MEDIA',
                description: ''
            },
            {
                name: 'Product launch',
                category: 'PROMOTIONS_MEDIA',
                description: ''
            },
            {
                name: 'Social media post',
                category: 'PROMOTIONS_MEDIA',
                description: ''
            },
            {
                name: 'Be My Brand/Product Ambassador',
                category: 'PROMOTIONS_MEDIA',
                description: ''
            },

            {
                name: 'Video Q&A',
                category: 'ENGAGEMENTS_INTERACTION',
                description: ''
            },
            {
                name: 'Sign Autographs',
                category: 'ENGAGEMENTS_INTERACTION',
                description: ''
            },
            {
                name: 'Mingle & Socialize',
                category: 'ENGAGEMENTS_INTERACTION',
                description: ''
            },
            {
                name: 'Run a Skills Clinic',
                category: 'ENGAGEMENTS_INTERACTION',
                description: ''
            },
            {
                name: 'Private Coaching',
                category: 'ENGAGEMENTS_INTERACTION',
                description: ''
            },
            {
                name: 'Keynote',
                category: 'ENGAGEMENTS_INTERACTION',
                description: ''
            },
            {
                name: 'Q&A',
                category: 'ENGAGEMENTS_INTERACTION',
                description: ''
            },

            {
                name: 'Fundraising',
                category: 'FUNDRAISING_OTHER',
                description: ''
            },
            { name: 'Other', category: 'FUNDRAISING_OTHER', description: '' }
        ];

        const addedCategories = [];

        await Promise.all(
            SPECIAL_REQUEST_TYPE_CATEGORIES.map(async (category) => {
                const existingCategory =
                    await this.specialRequestTypeCategoryModel.findOne({
                        code: category.code
                    });

                if (!existingCategory) {
                    const newCategory =
                        new this.specialRequestTypeCategoryModel(category);
                    await newCategory.save();
                    addedCategories.push(newCategory);
                }
            })
        );

        const addedTypes = [];

        await Promise.all(
            SPECIAL_REQUEST_TYPES.map(async (type) => {
                const category =
                    await this.specialRequestTypeCategoryModel.findOne({
                        code: type.category
                    });

                if (!category) {
                    throw new NotFoundException(
                        `Category with code ${type.category} not found`
                    );
                }

                const existingType = await this.specialRequestTypeModel.findOne(
                    {
                        name: type.name
                    }
                );

                if (!existingType) {
                    const newType = new this.specialRequestTypeModel({
                        ...type,
                        basePrice: 0,
                        estimatedDeliveryTime: 0,
                        categoryId: category._id
                    });
                    await newType.save();
                    addedTypes.push(newType);
                }
            })
        );

        return {
            categories: addedCategories,
            types: addedTypes
        };
    }

    public async;

    public async getRequestTypes(
        userId: Types.ObjectId,
        role: 'fan' | 'creator',
        filters: any = {}
    ): Promise<SpecialRequestTypeDto[]> {
        const query: any = { creatorId: null }; // Check if field is null

        if (filters.status) query.status = filters.status;

        const requests = await this.specialRequestTypeModel.find(query).lean();
        return requests.map((r) => new SpecialRequestTypeDto(r));
    }

    public async getCreatorsRequestTypes(
        userId: Types.ObjectId,
        role: 'fan' | 'creator',
        filters: any = {}
    ): Promise<SpecialRequestTypeDto[]> {
        const query: any = role === 'fan' ? {} : { creatorId: userId }; // Check if field is equal to input value

        if (filters.status) query.status = filters.status;

        const requests = await this.specialRequestTypeModel.find(query).lean();
        return requests.map((r) => new SpecialRequestTypeDto(r));
    }

    /**
     * Create a new special request
     */
    public async createSpecialRequestType(
        payload: SpecialRequestTypeCreatePayload,
        creatorId: Types.ObjectId
    ): Promise<SpecialRequestTypeDto> {
        if (
            // !payload.categoryId ||
            !payload.description ||
            !payload.name
        ) {
            throw new BadRequestException('Missing required fields');
        }

        if (
            payload.description.length < 10 ||
            payload.description.length > 500
        ) {
            throw new BadRequestException(
                'Description must be between 10 and 500 characters'
            );
        }

        // eslint-disable-next-line new-cap
        let request;
        console.log('payload', payload);
        if (payload._id) {
            console.log('has payload id');
            request = await this.specialRequestTypeModel.updateOne(
                { _id: payload._id },
                {
                    ...payload,
                    categoryId: !payload.categoryId ? null : payload.categoryId,
                    creatorId
                }
            );
        } else {
          // eslint-disable-next-line no-param-reassign
            delete payload._id;
            request = new this.specialRequestTypeModel({
                ...payload,
                categoryId: !payload.categoryId ? null : payload.categoryId,
                creatorId
            });
            await request.save();
        }

        console.log('request', request);

        const dto = new SpecialRequestTypeDto(request);

        return dto;
    }
}
