import { Schema, Types } from 'mongoose';
import { Storage } from 'src/modules/storage/contants';

export const FileSchema = new Schema({
  type: {
    type: String,
    index: true
  },
  name: String,
  description: String,
  mimeType: String,
  server: { type: String, index: true, default: Storage.DiskStorage },
  path: String,
  absolutePath: String,
  width: Number,
  height: Number,
  duration: Number,
  size: Number,
  status: String,
  encoding: String,
  // store array of the files
  thumbnails: Schema.Types.Mixed,
  // eg avatar is attached to what user model?
  refItems: [{
    itemId: Types.ObjectId,
    itemType: String,
    _id: false
  }],
  acl: {
    type: String,
    index: true
  },
  metadata: Schema.Types.Mixed,
  error: Schema.Types.Mixed,
  createdBy: Types.ObjectId,
  updatedBy: Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
