import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MaxLength
} from 'class-validator';

export class ReviewCreatePayload {
  @ApiProperty({ description: 'Rating for the request (1 to 5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
    rating: number;

  @ApiProperty({ description: 'Comments for the review (optional)' })
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
    comment: string;
}
