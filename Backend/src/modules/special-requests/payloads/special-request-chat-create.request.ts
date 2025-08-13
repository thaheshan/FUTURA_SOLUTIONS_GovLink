import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SpecialRequestChatCreatePayload {
  @ApiProperty({ description: 'The chat message content' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
    message: string;
}
