import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreatePageDto {
    @IsMongoId()
    @ApiProperty()
    userId: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    url: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;
}
