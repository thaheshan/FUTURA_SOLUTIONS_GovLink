import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  MaxLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SpecialRequestReviewUpdatePayload {
  @ApiProperty({ description: 'Updated rating for the request (1-5)' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
    rating?: number;

  @ApiProperty({ description: 'Updated textual review content' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
    comment?: string;

  @ApiProperty({
    description: 'Updated review status (e.g., approved, pending)'
  })
  @IsString()
  @IsOptional()
    reviewStatus?: string;

  @ApiProperty({
    description: 'Updated refund status (e.g., pending, refunded)'
  })
  @IsString()
  @IsOptional()
    refundStatus?: string;

  @ApiProperty({ description: 'Updated internal review notes' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
    reviewNotes?: string;
}
