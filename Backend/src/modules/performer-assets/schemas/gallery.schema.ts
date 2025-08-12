import { Schema, Types } from 'mongoose';

export const GallerySchema = new Schema({
  performerId: { type: Types.ObjectId, index: true },
  type: {
    type: String,
    index: true
  },
  title: {
    type: String
    // TODO - text index?
  },
  slug: {
    type: String,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true
  },
  description: String,
  status: {
    type: String,
    // draft, active
    default: 'active'
  },
  price: {
    type: Number,
    default: 0
  },
  isSale: {
    type: Boolean,
    default: false
  },
  numOfItems: {
    type: Number,
    default: 0
  },
  stats: {
    likes: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    }
  },
  coverPhotoId: Types.ObjectId,
  createdBy: Types.ObjectId,
  updatedBy: Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
