import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Page, PageDocument } from 'src/modules/page/entities/page.entity';

export enum Feature {
    AD_FREE_CONTENT = 'ad_free_content',
    EXCLUSIVE_BEHIND_THE_SCENES_ACCESS = 'exclusive_behind_the_scenes_access',
    COMMISSIONS_DIGITAL_GOODS = 'commissions_digital_goods',
    LIVE_EVENTS_VIP_EXPERIENCES = 'live_events_vip_experiences',
    INTERACTIVE_COMMUNITY_EXPERIENCES = 'interactive_community_experiences',
    SHOUT_OUTS_RECOGNITION = 'shout_outs_recognition',
    EDUCATIONAL_CONTENT = 'educational_content',
    DISCOUNT = 'discount',
    PRIVATE_COMMUNITY = 'private_community',
    MERCH_PROMO = 'merch_promo',
    CONTENT_LIBRARY_ACCESS = 'content_library_access'
}
export enum Plan {
    FREE = 'free',
    PREMIUM = 'premium',
    MVP = 'mvp'
}

export type MembershipPlanDocument = HydratedDocument<MembershipPlan>;

@Schema()
export class MembershipPlan {
    @Prop({ enum: Plan, required: true, default: Plan.FREE })
    plan: Plan;

    @Prop({ type: [String], enum: Feature, default: [] })
    features: Feature[];

    @Prop()
    price: number;

    @Prop({ type: Types.ObjectId, ref: Page.name, required: true })
    page: Types.ObjectId | PageDocument;
}

export const MembershipPlanSchema =
    SchemaFactory.createForClass(MembershipPlan);
MembershipPlanSchema.index({ page: 1, plan: 1 }, { unique: true });
