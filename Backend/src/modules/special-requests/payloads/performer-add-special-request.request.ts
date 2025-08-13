import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsMongoId,
  ValidateNested,
  IsBoolean,
  IsOptional,
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class SpecialRequestTypeItemPayload {
  @IsOptional()
  @IsMongoId()
  _id?: Types.ObjectId;

  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  requestDescription?: string;

  @IsOptional()
  @IsMongoId()
  specialRequestTypeId?: Types.ObjectId;

  @IsBoolean()
  enabled: boolean;

  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @IsOptional()
  @IsString()
  highlights?: string;
}

export class SpecialRequestTypeAddPerfomerPayload {
  @IsOptional()
  @IsMongoId()
  _id?: Types.ObjectId;

  @IsOptional()
  @IsString()
  pageDescription?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecialRequestTypeItemPayload)
  specialRequestTypes: SpecialRequestTypeItemPayload[];

  @IsNotEmpty()
  @IsBoolean()
  isPublished: boolean;
}
