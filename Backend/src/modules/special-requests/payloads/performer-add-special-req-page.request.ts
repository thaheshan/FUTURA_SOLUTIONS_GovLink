import {
  IsString,
  IsBoolean,
  IsOptional,
  IsMongoId,
  ValidateNested,
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class SpecialRequestTeaserVideoPayload {
  @IsOptional()
  @IsMongoId()
  _id?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  teaserVideoId?: Types.ObjectId;
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