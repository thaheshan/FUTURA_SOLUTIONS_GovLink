import { ApiProperty } from '@nestjs/swagger';
import {
  IsString, MaxLength, MinLength, IsNotEmpty
} from 'class-validator';

export class SpecialRequestRefundPayload {
  @ApiProperty({ description: 'Reason for refund request' })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  @IsNotEmpty()
    reason: string;
}
