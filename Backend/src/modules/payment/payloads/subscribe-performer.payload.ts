import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsOptional
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscribePerformerPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    performerId: string;

  @IsString()
  @IsOptional()
    cardId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['monthly', 'yearly', 'free'])
    type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    paymentGateway: string;
}
