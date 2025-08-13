import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsPositive } from 'class-validator';
import { Plan, Feature } from '../entities/membership-plan.entity';

export class CreateMembershipPlanDto {
    @ApiProperty()
    @IsEnum(Plan)
    plan: Plan;

    @ApiProperty()
    @IsPositive()
    price: number;

    @ApiProperty({ enum: Feature, isArray: true, default: [] })
    @IsEnum(Feature, { each: true })
    features: Feature[];

    @ApiProperty()
    @IsMongoId()
    pageId: string;
}
