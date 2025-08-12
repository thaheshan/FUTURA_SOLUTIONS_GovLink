import { Type } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MaxLength,
    Min,
    MinLength,
    ValidateNested
} from 'class-validator';
import { Types } from 'mongoose';

export class FanSpecialRequestContactDetailsPayload {
    @IsOptional()
    @IsString()
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
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    address: string;
}

export class SpecialRequestCreatePayload {
    @IsString()
    @IsNotEmpty()
    requestType: string;

    @IsString()
    @IsNotEmpty()
    creator: string;

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
}
