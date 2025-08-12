import {
  IsString,
  IsOptional,
  IsIn,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SPECIAL_REQUEST_STATUS } from '../constants';

export class SpecialRequestUpdatePayload {
  @ApiProperty({ description: 'Updated description for the request' })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(500)
    description?: string;

  @ApiProperty({ description: 'Updated status of the request' })
  @IsString()
  @IsOptional()
  @IsIn([
    SPECIAL_REQUEST_STATUS.PENDING,
    SPECIAL_REQUEST_STATUS.ACCEPTED,
    SPECIAL_REQUEST_STATUS.DECLINED,
    SPECIAL_REQUEST_STATUS.COMPLETED,
    SPECIAL_REQUEST_STATUS.REFUND_REQUESTED
  ])
    status?: string;
}
