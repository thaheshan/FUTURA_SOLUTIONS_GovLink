import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationUpdatePayload {
  @ApiProperty({ description: 'Mark as read/unread' })
  @IsBoolean()
  @IsNotEmpty()
    isRead: boolean;
}
