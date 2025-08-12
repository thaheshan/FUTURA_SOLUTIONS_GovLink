import { UserDto } from 'src/modules/user/dtos';
import { Types } from 'mongoose';
import { S3ObjectCannelACL } from 'src/modules/storage/contants';

/**
 * @param storage Storage
 * @uploadImmediately Upload to Storage immediately
 * @acl Access Control List
 */
export interface IFileUploadOptions {
  uploader?: UserDto;
  convertMp4?: boolean;
  generateThumbnail?: boolean;
  thumbnailSize?: {
    width: number;
    height: number;
  },
  refItem?: {
    itemId: Types.ObjectId;
    itemType: string;
  };
  fileName?: string;
  destination?: string;
  server?: string;
  uploadImmediately?: boolean;
  acl?: S3ObjectCannelACL;
}
