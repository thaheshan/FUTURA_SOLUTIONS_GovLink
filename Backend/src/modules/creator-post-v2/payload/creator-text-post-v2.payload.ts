import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsString,
    IsBoolean,
    ArrayUnique,
    IsEnum
} from 'class-validator';
import { PostVisibilityEnum } from '../constants';

export class CreatorTextPostV2Payload {
    @ApiProperty()
    @IsBoolean()
    allowComments: boolean;

    @ApiProperty()
    @IsEnum(PostVisibilityEnum)
    postVisibility: PostVisibilityEnum;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty({ isArray: true, type: String })
    @IsArray()
    @ArrayUnique()
    @IsString({ each: true })
    tags: string[];
}
