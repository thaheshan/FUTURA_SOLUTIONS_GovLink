import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';

import {
    MembershipPlan,
    MembershipPlanDocument
} from './entities/membership-plan.entity';
import { PageService } from '../page/page.service';

@Injectable()
export class MembershipPlanService {
    constructor(
        @Inject(MembershipPlan.name)
        private readonly membershipPlanModel: Model<MembershipPlanDocument>,
        @Inject(forwardRef(() => PageService))
        private readonly pageService: PageService
    ) {}

    async create(
        createMembershipPlanDto: CreateMembershipPlanDto
    ): Promise<MembershipPlanDocument> {
        const { plan, pageId, features, price } = createMembershipPlanDto;
        await this.pageService.getOrThrow(pageId);
        const exist = await this.membershipPlanModel.findOne({
            plan,
            page: new Types.ObjectId(pageId)
        });
        if (exist) {
            exist.price = price;
            exist.features = features;
            return exist.save();
        }
        return this.membershipPlanModel.create({
            plan,
            page: new Types.ObjectId(pageId),
            price,
            features
        });
    }

    async getOrThrow(id: string): Promise<MembershipPlanDocument> {
        const membershipPlan = await this.membershipPlanModel
            .findById(id)
            .exec();
        if (!membershipPlan) {
            throw new BadRequestException('Membership plan not found');
        }
        return membershipPlan;
    }

    remove(id: string) {
        return this.membershipPlanModel.findByIdAndDelete(id).exec();
    }

    async getForPage(pageId: string): Promise<MembershipPlanDocument[]> {
        return (
            this.membershipPlanModel
                .find({
                    page: new Types.ObjectId(pageId)
                })
                .exec() || []
        );
    }
}
