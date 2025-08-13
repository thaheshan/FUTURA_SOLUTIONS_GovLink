import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SpecialRequestChatListRequest {
  @ApiProperty({ description: 'Special request ID', required: true })
  @IsString()
    requestId: string;

  @ApiProperty({ description: 'Number of items to fetch', default: 10 })
  @IsNumber()
  @IsOptional()
    limit: number;

  @ApiProperty({ description: 'Number of items to skip', default: 0 })
  @IsNumber()
  @IsOptional()
    offset: number;
}
