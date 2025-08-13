import { IsString, IsOptional } from 'class-validator';
import { SearchRequest } from 'src/kernel/common';
import { ApiProperty } from '@nestjs/swagger';

export class SpecialRequestSearchRequest extends SearchRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
    fanID: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    creatorID: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    requestTypeID: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    q: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    fromDate: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    toDate: string;
}
