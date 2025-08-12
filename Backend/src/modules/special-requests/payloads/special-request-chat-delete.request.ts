import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SpecialRequestChatDeletePayload {
  @ApiProperty({ description: 'ID of the message to delete' })
  @IsString()
  @IsNotEmpty()
    messageId: string;
}
