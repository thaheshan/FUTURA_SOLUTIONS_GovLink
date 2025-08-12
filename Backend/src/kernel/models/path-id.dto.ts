import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class PathIdDto {
    @ApiProperty()
    @IsMongoId()
    id: string;
}
