import {
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
  Min,
  Max
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SpecialRequestFeedbackUpdatePayload {
  @ApiProperty({ description: 'Updated rating for the request (1-5)' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
    rating?: number;

  @ApiProperty({ description: 'Updated feedback comment' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
    comment?: string;
}
