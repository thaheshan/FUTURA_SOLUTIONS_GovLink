import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MaxLength
} from 'class-validator';

export class SpecialRequestTypeCreatePayload {
  @ApiProperty({ description: 'the id of the request to be updated', nullable: true })
  @IsString()
    _id?: string;

  @ApiProperty({ description: 'the name of the request' })
  @IsString()
  @IsNotEmpty()
    name: string;

  @ApiProperty({ description: 'The ID of the category' })
  @IsString()
    categoryId: string;

  @ApiProperty({ description: 'the description of the type' })
  @IsString()
  @IsNotEmpty()
    description: string;

  @ApiProperty({ description: 'the base price of the type' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1000000)
    basePrice: number;

  @ApiProperty({ description: 'the estimated delivery time of the type' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1000000)
    estimatedDeliveryTime: number;

  @ApiProperty({ description: 'the highlights of the type' })
  @IsString()
  @MaxLength(1000)
    highlights: string;

  @ApiProperty({ description: 'whether the request type is enabled' })
  @IsNotEmpty()
    enabled: boolean;
}
