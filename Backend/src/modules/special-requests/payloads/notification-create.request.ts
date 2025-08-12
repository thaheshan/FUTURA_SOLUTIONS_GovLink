import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationCreatePayload {
  @ApiProperty({ description: 'The notification title' })
  @IsString()
  @IsNotEmpty()
    title: string;

  @ApiProperty({ description: 'The notification content' })
  @IsString()
  @IsNotEmpty()
    content: string;
}
