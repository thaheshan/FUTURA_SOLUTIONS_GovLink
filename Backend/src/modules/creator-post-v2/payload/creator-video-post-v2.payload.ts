import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsString,
    IsNotEmpty,
    IsBoolean,
    ArrayUnique,
    IsEnum
} from 'class-validator';
import { PostVisibilityEnum } from '../constants';

export class CreatorVideoPostV2Payload {
    @ApiProperty()
    @IsBoolean()
    allowComments: boolean;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsEnum(PostVisibilityEnum)
    postVisibility: PostVisibilityEnum;

    @ApiProperty({ isArray: true, type: String })
    @IsArray()
    @ArrayUnique()
    @IsString({ each: true })
    tags: string[];

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    video: string;
}
