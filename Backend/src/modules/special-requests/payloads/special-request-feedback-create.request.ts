import {
  IsString,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  Min,
  Max
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SpecialRequestFeedbackCreatePayload {
  @ApiProperty({ description: 'Rating for the request (1-5)' })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
    rating: number;

  @ApiProperty({ description: 'Optional feedback comment' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
    comment: string;
}
