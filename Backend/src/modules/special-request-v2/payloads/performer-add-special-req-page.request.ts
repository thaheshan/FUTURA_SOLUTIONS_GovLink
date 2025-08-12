import {
    IsString,
    IsBoolean,
    IsOptional,
    ValidateNested,
    IsArray,
    IsMongoId
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class SpecialRequestTeaserVideoPayload {
    @IsOptional()
    @IsString()
    teaserVideo?: string;
}

export class SpecialRequestPerformerPublishPagePayload {
    @IsOptional()
    @IsMongoId()
    _id?: Types.ObjectId;

    @IsOptional()
    @IsString()
    pageDescription?: string;

    @IsBoolean()
    isPublished: boolean;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SpecialRequestTeaserVideoPayload)
    specialRequestTeaserVideo: SpecialRequestTeaserVideoPayload[];
}
