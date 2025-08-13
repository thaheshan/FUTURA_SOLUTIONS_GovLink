/* eslint-disable camelcase */
import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Rekognition } from 'aws-sdk';
import {
    createReadStream,
    existsSync,
    readFileSync,
    unlinkSync,
    writeFileSync
} from 'fs';
import * as jwt from 'jsonwebtoken';
import { Model, Types } from 'mongoose';
import { join } from 'path';
import {
    EntityNotFoundException,
    QueueEvent,
    QueueEventService,
    getConfig
} from 'src/kernel';
import { formatFileName } from 'src/kernel/helpers/multer.helper';
import { toPosixPath } from 'src/kernel/helpers/string.helper';
import { S3ObjectCannelACL, Storage } from 'src/modules/storage/contants';
import { S3Service, S3StorageService } from 'src/modules/storage/services';
import { FileDto } from '../dtos';
import { IFileUploadOptions } from '../lib';
import { IMulterUploadedFile } from '../lib/multer/multer.utils';
import { FileModel } from '../models';
import { FILE_MODEL_PROVIDER } from '../providers';
import { AudioFileService } from './audio.service';
import { ImageService } from './image.service';
import { VideoFileService } from './video.service';

const VIDEO_QUEUE_CHANNEL = 'VIDEO_PROCESS';
const AUDIO_QUEUE_CHANNEL = 'AUDIO_PROCESS';
const PHOTO_QUEUE_CHANNEL = 'PHOTO_PROCESS';

export const FILE_EVENT = {
    VIDEO_PROCESSED: 'VIDEO_PROCESSED',
    PHOTO_PROCESSED: 'PHOTO_PROCESSED',
    AUDIO_PROCESSED: 'AUDIO_PROCESSED'
};

interface FileServiceData extends QueueEvent {
    data: {
        file: any;
        options: any;
    };
}

@Injectable()
export class FileService {
    private readonly rekognition: Rekognition;

    constructor(
        @Inject(forwardRef(() => S3StorageService))
        private readonly s3StorageService: S3StorageService,
        @Inject(FILE_MODEL_PROVIDER)
        private readonly fileModel: Model<FileModel>,
        private readonly imageService: ImageService,
        private readonly videoService: VideoFileService,
        private readonly audioFileService: AudioFileService,
        private readonly queueEventService: QueueEventService,
        private readonly config: ConfigService
    ) {
        this.rekognition = new Rekognition({
            region: process.env.AWS_REKOGNITION_KEY_REGION,
            accessKeyId: process.env.AWS_REKOGNITION_KEY_ID,
            secretAccessKey: process.env.AWS_REKOGNITION_KEY_SECRET
        });
        this.queueEventService.subscribe(
            VIDEO_QUEUE_CHANNEL,
            'PROCESS_VIDEO',
            this._processVideo.bind(this)
        );

        this.queueEventService.subscribe(
            AUDIO_QUEUE_CHANNEL,
            'PROCESS_AUDIO',
            this._processAudio.bind(this)
        );

        this.queueEventService.subscribe(
            PHOTO_QUEUE_CHANNEL,
            'PROCESS_PHOTO',
            this._processPhoto.bind(this)
        );
    }

    public async findById(id: string | Types.ObjectId): Promise<FileDto> {
        const model = await this.fileModel.findById(id);
        if (!model) return null;
        return new FileDto(model);
    }

    public async findByIds(
        ids: string[] | Types.ObjectId[]
    ): Promise<FileDto[]> {
        const items = await this.fileModel.find({
            _id: {
                $in: ids
            }
        });

        return items.map((i) => new FileDto(i));
    }

    public async countByRefType(itemType: string): Promise<any> {
        const count = await this.fileModel.countDocuments({
            refItems: { $elemMatch: { itemType } }
        });
        return count;
    }

    public async findByRefType(
        itemType: string,
        limit: number,
        offset: number
    ): Promise<any> {
        const items = await this.fileModel
            .find({
                refItems: { $elemMatch: { itemType } }
            })
            .limit(limit)
            .skip(offset * limit);
        return items.map((item) => new FileDto(item));
    }

    public async createFromMulter(
        type: string,
        multerData: IMulterUploadedFile,
        fileUploadOptions?: IFileUploadOptions
    ): Promise<FileDto> {
        const options = fileUploadOptions ? { ...fileUploadOptions } : {};

        const { publicDir, photoDir } = getConfig('file');
        const checkS3Settings = await this.s3StorageService.checkSetting();
        let absolutePath = multerData.path;
        let path = multerData.path.replace(publicDir, '');
        let { metadata = {} } = multerData;
        let server = options.server || Storage.DiskStorage;
        if (server === Storage.S3 && !checkS3Settings) {
            server = Storage.DiskStorage;
        }
        const thumbnails = [];

        // create thumb
        if (
            multerData.mimetype.includes('image') &&
            options.uploadImmediately &&
            options.generateThumbnail
        ) {
            const thumbBuffer = (await this.imageService.createThumbnail(
                multerData.path,
                options.thumbnailSize || { width: 500, height: 500 }
            )) as Buffer;
            const thumbName = `${new Date().getTime()}_thumb`;
            if (fileUploadOptions.server === Storage.S3 && checkS3Settings) {
                const [uploadThumb] = await Promise.all([
                    this.s3StorageService.upload(
                        thumbName,
                        fileUploadOptions.acl,
                        thumbBuffer,
                        multerData.mimetype
                    )
                ]);
                if (uploadThumb.Key && uploadThumb.Location) {
                    thumbnails.push({
                        thumbnailSize: options.thumbnailSize || {
                            width: 500,
                            height: 500
                        },
                        path: uploadThumb.Location,
                        absolutePath: uploadThumb.Key
                    });
                }
            } else {
                writeFileSync(join(photoDir, thumbName), thumbBuffer);
                thumbnails.push({
                    thumbnailSize: options.thumbnailSize || {
                        width: 500,
                        height: 500
                    },
                    path: toPosixPath(
                        join(photoDir, thumbName).replace(publicDir, '')
                    ),
                    absolutePath: toPosixPath(join(photoDir, thumbName))
                });
            }
        }
        // upload file
        if (
            options.uploadImmediately &&
            fileUploadOptions.server === Storage.S3 &&
            checkS3Settings
        ) {
            const buffer = multerData.mimetype.includes('image') ?
                await this.imageService.replaceWithoutExif(
                      multerData.path,
                      multerData.mimetype
                  ) :
                readFileSync(multerData.path);
            const upload = await this.s3StorageService.upload(
                formatFileName(multerData),
                fileUploadOptions.acl,
                buffer,
                multerData.mimetype
            );
            if (upload.Key && upload.Location) {
                absolutePath = upload.Key;
                path = upload.Location;
            }
            metadata = {
                ...metadata,
                bucket: upload.Bucket,
                endpoint: S3Service.getEndpoint()
            };
            // remove old file once upload s3 done
            existsSync(multerData.path) && unlinkSync(multerData.path);
        } else {
            server = Storage.DiskStorage;
            path = toPosixPath(path);
        }
        const data = {
            type,
            name: multerData.filename,
            description: '',
            mimeType: multerData.mimetype,
            server,
            path,
            absolutePath,
            acl: multerData.acl || options.acl,
            thumbnails,
            metadata,
            size: multerData.size,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: options.uploader ? options.uploader._id : null,
            updatedBy: options.uploader ? options.uploader._id : null
        };

        const file = await this.fileModel.create(data);
        // TODO - check option and process
        // eg create thumbnail, video converting, etc...
        return FileDto.fromModel(file);
    }

    public async addRef(
        fileId: Types.ObjectId | string,
        ref: {
            itemId: Types.ObjectId;
            itemType: string;
        }
    ) {
        await this.fileModel.updateOne(
            { _id: fileId },
            {
                $addToSet: {
                    refItems: ref
                }
            }
        );
    }

    public async removeMany(fileIds: string[] | Types.ObjectId[]) {
        const files = await this.fileModel.find({ _id: { $in: fileIds } });
        if (!files.length) {
            return false;
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const file of files) {
            // eslint-disable-next-line no-await-in-loop
            await this.fileModel.deleteOne({ _id: file._id });
            const filePaths = [
                {
                    absolutePath: file.absolutePath,
                    path: file.path
                }
            ].concat(file.thumbnails || []);

            if (file.server === Storage.S3) {
                const del = filePaths.map((fp) => ({ Key: fp.absolutePath }));
                // eslint-disable-next-line no-await-in-loop
                await this.s3StorageService.deleteObjects({ Objects: del });
                return true;
            }

            filePaths.forEach((fp) => {
                if (existsSync(fp.absolutePath)) {
                    unlinkSync(fp.absolutePath);
                } else {
                    const publicDir = this.config.get('file.publicDir');
                    const filePublic = join(publicDir, fp.path);
                    existsSync(filePublic) && unlinkSync(filePublic);
                }
            });
        }
        return true;
    }

    public async remove(fileId: string | Types.ObjectId) {
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file) {
            return false;
        }
        await this.fileModel.deleteOne({ _id: file._id });

        const filePaths = [
            {
                absolutePath: file.absolutePath,
                path: file.path
            }
        ].concat(file.thumbnails || []);

        if (file.server === Storage.S3) {
            const del = filePaths.map((fp) => ({ Key: fp.absolutePath }));
            await this.s3StorageService.deleteObjects({ Objects: del });
            return true;
        }

        filePaths.forEach((fp) => {
            if (existsSync(fp.absolutePath)) {
                unlinkSync(fp.absolutePath);
            } else {
                const { publicDir } = getConfig('file');
                const filePublic = join(publicDir, fp.path);
                existsSync(filePublic) && unlinkSync(filePublic);
            }
        });
        // TODO - fire event
        return true;
    }

    public async deleteManyByRefIds(refIds: string[] | Types.ObjectId[]) {
        if (!refIds.length) return;
        const files = await this.fileModel.find({
            refItems: {
                $elemMatch: {
                    itemId: { $in: refIds }
                }
            }
        });
        await this.fileModel.deleteMany({ _id: files.map((f) => f._id) });
        // remove files
        await files.reduce(async (cb, file) => {
            await cb;
            const filePaths = [
                {
                    absolutePath: file.absolutePath,
                    path: file.path
                }
            ].concat(file.thumbnails || []);
            if (file.server === Storage.S3) {
                const del = filePaths.map((fp) => ({ Key: fp.absolutePath }));
                await this.s3StorageService.deleteObjects({ Objects: del });
                return Promise.resolve();
            }
            filePaths.map((fp) => {
                if (existsSync(fp.absolutePath)) {
                    unlinkSync(fp.absolutePath);
                } else {
                    const { publicDir } = getConfig('file');
                    const filePublic = join(publicDir, fp.path);
                    existsSync(filePublic) && unlinkSync(filePublic);
                }
                return fp;
            });
            return Promise.resolve();
        }, Promise.resolve());
    }

    public async removeIfNotHaveRef(fileId: string | Types.ObjectId) {
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file) {
            return false;
        }

        if (file.refItems && !file.refItems.length) {
            return false;
        }

        await this.fileModel.deleteOne({ _id: file._id });

        if (file.server === Storage.S3) {
            const del = [{ Key: file.absolutePath }];
            await this.s3StorageService.deleteObjects({ Objects: del });
            return true;
        }

        if (existsSync(file.absolutePath)) {
            unlinkSync(file.absolutePath);
        } else {
            const { publicDir } = getConfig('file');
            const filePublic = join(publicDir, file.path);
            existsSync(filePublic) && unlinkSync(filePublic);
        }

        // TODO - fire event
        return true;
    }

    // TODO - fix here, currently we just support local server, need a better solution if scale?
    /**
     * generate mp4 video & thumbnail
     * @param fileId
     * @param options
     */
    public async queueProcessVideo(
        fileId: string | Types.ObjectId,
        options?: {
            meta?: Record<string, any>;
            publishChannel?: string;
            size?: string; // 500x500
            count?: number; // num of thumbnails
        }
    ) {
        // add queue and convert file to mp4 and generate thumbnail
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file || file.status === 'processing') {
            return false;
        }
        await this.queueEventService.publish(
            new QueueEvent({
                channel: VIDEO_QUEUE_CHANNEL,
                eventName: 'processVideo',
                data: {
                    file: new FileDto(file),
                    options
                }
            })
        );
        return true;
    }

    private async _processVideo(event: FileServiceData) {
        if (event.eventName !== 'processVideo') {
            return;
        }

        const fileData = event.data.file as FileDto;
        const options = event.data.options || {};
        // get thumb of the file, then convert to mp4
        const { publicDir, videoDir } = getConfig('file');
        let videoPath = fileData.absolutePath;
        let newAbsolutePath = fileData.absolutePath;
        let newPath = fileData.path;
        let { metadata = {}, server } = fileData;
        if (existsSync(fileData.absolutePath)) {
            videoPath = fileData.absolutePath;
        } else if (existsSync(join(publicDir, fileData.path))) {
            videoPath = join(publicDir, fileData.path);
        }

        try {
            await this.fileModel.updateOne(
                { _id: fileData._id },
                {
                    $set: {
                        status: 'processing'
                    }
                }
            );

            const respVideo = await this.videoService.convert2Mp4(videoPath);
            newAbsolutePath = respVideo.toPath;
            newPath = respVideo.toPath.replace(publicDir, '');
            const meta = await this.videoService.getMetaData(videoPath);
            const videoMeta = meta.streams.find(
                (s) => s.codec_type === 'video'
            );
            const {
                width = 500,
                height = 500,
                rotation = '0'
            } = videoMeta || {};
            const respThumb = await this.videoService.createThumbs(videoPath, {
                toFolder: videoDir,
                size:
                    options?.size ||
                    (['90', '-90', '270', '-270'].includes(rotation) ?
                        `${height}x${width}` :
                        `${width}x${height}`),
                count: options?.count || 1
            });
            let thumbnails: any = [];
            // check s3 settings
            const checkS3Settings = await this.s3StorageService.checkSetting();
            if (fileData.server === Storage.S3 && checkS3Settings) {
                const video = readFileSync(respVideo.toPath);
                const result = await this.s3StorageService.upload(
                    respVideo.fileName,
                    fileData.acl,
                    video,
                    'video/mp4'
                );
                newAbsolutePath = result.Key;
                newPath = result.Location;
                // eslint-disable-next-line prefer-template
                metadata = {
                    ...metadata,
                    bucket: result.Bucket,
                    endpoint: S3Service.getEndpoint()
                };
                if (respThumb.length) {
                    // eslint-disable-next-line no-restricted-syntax
                    for (const name of respThumb) {
                        if (existsSync(join(videoDir, name))) {
                            const file = readFileSync(join(videoDir, name));
                            // eslint-disable-next-line no-await-in-loop
                            const thumb = await this.s3StorageService.upload(
                                name,
                                S3ObjectCannelACL.PublicRead,
                                file,
                                'image/jpg'
                            );
                            thumbnails.push({
                                path: thumb.Location,
                                absolutePath: thumb.Key
                            });
                            unlinkSync(join(videoDir, name));
                        }
                    }
                }
                // remove converted file once uploaded s3 done
                existsSync(respVideo.toPath) && unlinkSync(respVideo.toPath);
            } else {
                server = Storage.DiskStorage;
                thumbnails = respThumb.map((name) => ({
                    absolutePath: join(videoDir, name),
                    path: toPosixPath(
                        join(videoDir, name).replace(publicDir, '')
                    )
                }));
                newPath = toPosixPath(newPath);
            }
            // remove old file
            existsSync(videoPath) && unlinkSync(videoPath);
            await this.fileModel.updateOne(
                { _id: fileData._id },
                {
                    $set: {
                        status: 'finished',
                        absolutePath: newAbsolutePath,
                        path: newPath,
                        thumbnails,
                        duration: parseInt(meta.format.duration, 10),
                        metadata,
                        server,
                        width,
                        height
                    }
                }
            );
        } catch (e) {
            await this.fileModel.updateOne(
                { _id: fileData._id },
                {
                    $set: {
                        status: 'error',
                        error: e?.stack || e
                    }
                }
            );
            throw new HttpException(e, 500);
        } finally {
            // TODO - fire event to subscriber
            if (options.publishChannel) {
                await this.queueEventService.publish(
                    new QueueEvent({
                        channel: options.publishChannel,
                        eventName: FILE_EVENT.VIDEO_PROCESSED,
                        data: {
                            meta: options.meta,
                            fileId: fileData._id
                        }
                    })
                );
            }
        }
    }

    /**
     * generate mp4 video & thumbnail
     * @param fileId
     * @param options
     */
    public async queueProcessAudio(
        fileId: string | Types.ObjectId,
        options?: {
            meta?: Record<string, any>;
            publishChannel?: string;
        }
    ) {
        // add queue and convert file to mp4 and generate thumbnail
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file || file.status === 'processing') {
            return false;
        }
        await this.queueEventService.publish(
            new QueueEvent({
                channel: AUDIO_QUEUE_CHANNEL,
                eventName: 'processAudio',
                data: {
                    file: new FileDto(file),
                    options
                }
            })
        );
        return true;
    }

    private async _processAudio(event: FileServiceData) {
        if (event.eventName !== 'processAudio') {
            return;
        }
   
        const fileData = event.data.file as FileDto;
        if (fileData.mimeType.includes('mp3')) return;

        const options = event.data.options || {};
        const { publicDir } = getConfig('file');
        let audioPath = '';
        let newAbsolutePath = '';
        let newPath = '';
        let { metadata = {}, server } = fileData;
        if (existsSync(fileData.absolutePath)) {
            audioPath = fileData.absolutePath;
        } else if (existsSync(join(publicDir, fileData.path))) {
            audioPath = join(publicDir, fileData.path);
        }
        try {
            await this.fileModel.updateOne(
                { _id: fileData._id },
                {
                    $set: {
                        status: 'processing'
                    }
                }
            );

            const respAudio = await this.audioFileService.convert2Mp3(
                audioPath
            );
            newAbsolutePath = respAudio.toPath;
            newPath = respAudio.toPath.replace(publicDir, '');
            // check s3 settings
            const checkS3Settings = await this.s3StorageService.checkSetting();
            if (fileData.server === Storage.S3 && checkS3Settings) {
                const audio = readFileSync(respAudio.toPath);
                const result = await this.s3StorageService.upload(
                    respAudio.fileName,
                    fileData.acl,
                    audio,
                    'audio/mp3'
                );
                newAbsolutePath = result.Key;
                newPath = result.Location;
                // eslint-disable-next-line prefer-template
                metadata = {
                    ...metadata,
                    bucket: result.Bucket,
                    endpoint: S3Service.getEndpoint()
                };
                existsSync(respAudio.toPath) && unlinkSync(respAudio.toPath);
            } else {
                server = Storage.DiskStorage;
                newPath = toPosixPath(newPath);
            }
            const meta = await this.videoService.getMetaData(audioPath);
            existsSync(audioPath) && unlinkSync(audioPath);

            await this.fileModel.updateOne(
                { _id: fileData._id },
                {
                    $set: {
                        status: 'finished',
                        absolutePath: newAbsolutePath,
                        path: newPath,
                        duration: parseInt(meta?.format?.duration, 10) || null,
                        mimeType: 'audio/mp3',
                        name: fileData.name.replace(
                            `.${fileData.mimeType.split('audio/')[1]}`,
                            '.mp3'
                        ),
                        metadata,
                        server
                    }
                }
            );
        } catch (e) {
            // existsSync(audioPath) && unlinkSync(audioPath);
            // existsSync(newAbsolutePath) && unlinkSync(newAbsolutePath);
            await this.fileModel.updateOne(
                { _id: fileData._id },
                {
                    $set: {
                        status: 'error',
                        error: e?.stack || e
                    }
                }
            );
            throw new HttpException(e, 500);
        } finally {
            // TODO - fire event to subscriber
            if (options.publishChannel) {
                await this.queueEventService.publish(
                    new QueueEvent({
                        channel: options.publishChannel,
                        eventName: FILE_EVENT.AUDIO_PROCESSED,
                        data: {
                            meta: options.meta,
                            fileId: fileData._id
                        }
                    })
                );
            }
        }
    }

    /**
     * process to create photo thumbnails
     * @param fileId file item
     * @param options
     */
    public async queueProcessPhoto(
        fileId: string | Types.ObjectId,
        options?: {
            meta?: Record<string, any>;
            publishChannel?: string;
            thumbnailSize: {
                width: number;
                height: number;
            };
        }
    ) {
        // add queue and convert file to mp4 and generate thumbnail
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file || file.status === 'processing') {
            return false;
        }
        await this.queueEventService.publish(
            new QueueEvent({
                channel: PHOTO_QUEUE_CHANNEL,
                eventName: 'processPhoto',
                data: {
                    file: new FileDto(file),
                    options
                }
            })
        );
        return true;
    }

    private async _processPhoto(event: FileServiceData) {
        if (event.eventName !== 'processPhoto') {
            return;
        }
        const fileData = event.data.file as FileDto;
        let { metadata = {}, server } = fileData;
        const options = event.data.options || {};
        const { publicDir, photoDir } = getConfig('file');
        let thumbnailAbsolutePath = '';
        let thumbnailPath = '';
        let { absolutePath } = fileData;
        let photoPath = join(publicDir, fileData.path);

        if (existsSync(fileData.absolutePath)) {
            photoPath = fileData.absolutePath;
        } else if (existsSync(join(publicDir, fileData.path))) {
            photoPath = join(publicDir, fileData.path);
        }

        try {
            await this.fileModel.updateOne(
                { _id: fileData._id },
                {
                    $set: {
                        status: 'processing'
                    }
                }
            );
            const meta = await this.imageService.getMetaData(photoPath);
            const thumbBuffer = (await this.imageService.createThumbnail(
                photoPath,
                options.thumbnailSize || {
                    width: 250,
                    height: 250
                }
            )) as Buffer;

            // create a thumbnail
            const thumbName = `thumb-${new Date().getTime()}.jpg`;
            // check s3 settings
            const checkS3Settings = await this.s3StorageService.checkSetting();
            // upload thumb to s3
            if (fileData.server === Storage.S3 && checkS3Settings) {
                const upload = await this.s3StorageService.upload(
                    thumbName,
                    S3ObjectCannelACL.PublicRead,
                    thumbBuffer,
                    fileData.mimeType
                );
                thumbnailAbsolutePath = upload.Key;
                thumbnailPath = upload.Location;
            } else {
                thumbnailPath = toPosixPath(
                    join(photoDir, thumbName).replace(publicDir, '')
                );
                thumbnailAbsolutePath = join(photoDir, thumbName);
                writeFileSync(join(photoDir, thumbName), thumbBuffer);
            }
            const buffer = await this.imageService.replaceWithoutExif(
                photoPath,
                fileData.mimeType
            );
            // upload file to s3
            if (fileData.server === Storage.S3 && checkS3Settings) {
                const upload = await this.s3StorageService.upload(
                    fileData.name,
                    fileData.acl,
                    buffer,
                    fileData.mimeType
                );
                if (upload.Key && upload.Location) {
                    absolutePath = upload.Key;
                    photoPath = upload.Location;
                }
                metadata = {
                    ...metadata,
                    bucket: upload.Bucket,
                    endpoint: S3Service.getEndpoint()
                };
                // remove old file once upload s3 done
                existsSync(fileData.absolutePath) &&
                    unlinkSync(fileData.absolutePath);
            } else {
                writeFileSync(photoPath, buffer);
                absolutePath = photoPath;
                photoPath = toPosixPath(photoPath.replace(publicDir, ''));
                server = Storage.DiskStorage;
            }
            await this.fileModel.updateOne(
                { _id: fileData._id },
                {
                    $set: {
                        status: 'finished',
                        width: meta.width,
                        height: meta.height,
                        metadata,
                        server,
                        absolutePath,
                        path: photoPath,
                        thumbnails: [
                            {
                                path: thumbnailPath,
                                absolutePath: thumbnailAbsolutePath
                            }
                        ]
                    }
                }
            );
        } catch (e) {
            // existsSync(fileData.absolutePath) && unlinkSync(fileData.absolutePath);
            await this.fileModel.updateOne(
                { _id: fileData._id },
                {
                    $set: {
                        status: 'error',
                        error: e?.stack || e
                    }
                }
            );
            throw new HttpException(e, 500);
        } finally {
            // TODO - fire event to subscriber
            if (options.publishChannel) {
                await this.queueEventService.publish(
                    new QueueEvent({
                        channel: options.publishChannel,
                        eventName: FILE_EVENT.PHOTO_PROCESSED,
                        data: {
                            meta: options.meta,
                            fileId: fileData._id
                        }
                    })
                );
            }
        }
    }

    public async isExplicitContent(file: FileDto) {
        if (!file) return false;
        const buffer = readFileSync(file.absolutePath);
        const params = {
            Image: {
                Bytes: buffer
            },
            MinConfidence: 70
        };

        const data = await this.rekognition
            .detectModerationLabels(params)
            .promise();
        const moderationLabels = data.ModerationLabels;
        // sort by TaxonomyLevel
        moderationLabels.sort(
            (a: any, b: any) => a.TaxonomyLevel - b.TaxonomyLevel
        );
        if (
            moderationLabels.length > 0 &&
            moderationLabels[0].Name === 'Explicit'
        ) {
            return true;
        }
        return false;
    }

    /**
     * just generate key for
     */
    private generateJwt(fileId: string | Types.ObjectId) {
        // 3h
        const expiresIn = 60 * 60 * 3;
        return jwt.sign(
            {
                fileId
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn
            }
        );
    }

    /**
     * generate download file url with expired time check
     * @param fileId
     * @param param1
     */
    public async generateDownloadLink(fileId: string | Types.ObjectId) {
        const newUrl = new URL('files/download', getConfig('app').baseUrl);
        newUrl.searchParams.append('key', this.generateJwt(fileId));
        return newUrl.href;
    }

    public async getStreamToDownload(key: string) {
        try {
            const decoded = jwt.verify(key, process.env.TOKEN_SECRET) as {
                fileId: string;
            };

            const file = await this.fileModel.findById(decoded.fileId);
            if (!file) throw new EntityNotFoundException();
            let filePath;
            const { publicDir } = getConfig('file');
            if (existsSync(file.absolutePath)) {
                filePath = file.absolutePath;
            } else if (existsSync(join(publicDir, file.path))) {
                filePath = join(publicDir, file.path);
            } else {
                throw new EntityNotFoundException();
            }

            return {
                file,
                stream: createReadStream(filePath)
            };
        } catch (e) {
            throw new EntityNotFoundException();
        }
    }

    public async getFileStatus(fileId: string, query: any, jwToken: string) {
        const file = await this.fileModel.findById(fileId);
        const dto = new FileDto(file);
        let fileUrl = dto.getUrl(true);
        if (file.server !== Storage.S3) {
            fileUrl = `${fileUrl}?${query.target}=${query.targetId}&token=${jwToken}`;
        }
        return {
            ...dto.toResponse(),
            thumbnails: dto.getThumbnails(),
            url: fileUrl
        };
    }
}
