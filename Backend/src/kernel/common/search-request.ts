import {
  IsString, IsOptional, IsInt
} from 'class-validator';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class SearchRequest {
  @ApiProperty()
  @IsOptional()
  @IsString()
    q = '';

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Transform(({ value }) => {
    if (!value) return 10;
    if (value > 200) return 200;
    return value;
  })
    limit = 10;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Transform(({ value }) => {
    if (!value || value < 0) return 0;
    return value;
  })
    offset = 0;

  @ApiProperty()
  @Optional()
  @IsString()
    sortBy = 'updatedAt';

  @ApiProperty()
  @Optional()
  @IsString()
  @Transform(({ value }) => {
    if (value !== 'asc') return 'desc';
    return 'asc';
  })
    sort = 'desc';
}
