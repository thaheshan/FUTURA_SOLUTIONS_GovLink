export interface IFile {
  _id: string;

  type: string; // video, podcast, file, etc...

  name: string;

  description: string;

  mimeType: string;

  server: string;

  path: string; // path of key in local or server

  absolutePath: string;

  width: number; // for video, img

  height: number; // for video, img

  duration: number;

  size: number;

  status: string;

  encoding: string;

  thumbnails: Record<string, any>[];

  refItems: any;

  acl: string;

  metadata: any;

  url: string;

  createdAt: Date;

  updatedAt: Date;
}
