import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import { Types } from 'mongoose';

export class FanSpecialRequestContactDetailsPayload {
  @IsOptional()
  @IsMongoId()
  _id?: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
    country: string;

  @IsString()
  @IsNotEmpty()
    firstName: string;

  @IsString()
  @IsNotEmpty()
    lastName: string;

  @IsString()
  @IsNotEmpty()
    requesterEmail: string;

  @IsString()
  @IsNotEmpty()
    requesterPhoneNumber: string;

  @IsString()
  @IsNotEmpty()
    requesterAddress: string;
}

export class SpecialRequestCreatePayload {
  @IsString()
  @IsNotEmpty()
    requestTypeID: string;

  @IsString()
  @IsNotEmpty()
    creatorID: string;

  @IsString()
  @IsNotEmpty()
    eventType: string;

  @IsString()
  @IsNotEmpty()
    eventLocation: string;

  @IsString()
  @IsNotEmpty()
    eventDuration: string;

  @IsString()
  @IsNotEmpty()
    eventDate: Date;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  @IsNotEmpty()
    messageToPerformer: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FanSpecialRequestContactDetailsPayload)
    contactDetails: FanSpecialRequestContactDetailsPayload;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
    totalPrice: number;

  // TODO we havent used these, deadline based dto/model alteration
  // @ApiProperty({ description: 'Deadline for the request', required: false })
  // @IsString()
  // @IsOptional()
  //   deadline?: string;

  // @ApiProperty({ description: 'Additional notes or instructions', required: false })
  // @IsString()
  // @MaxLength(1000)
  // @IsOptional()
  //   notes?: string;

  // @ApiProperty({ description: 'Attachments related to the request', required: false })
  // @IsString({ each: true })
  // @IsOptional()
  //   attachments?: string[];

  // @ApiProperty({ description: 'Additional details of the special request', required: true })
  // @IsJSON({ each: true })
  // @IsNotEmpty()
  //   details: string[];
}
