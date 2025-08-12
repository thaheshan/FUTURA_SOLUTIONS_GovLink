import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { UserV2Service } from 'src/modules/user-v2/user-v2.service';
import { BadRequestAppError } from 'src/errors/bad-request-app-error';
import { Page, PageDocument } from './entities/page.entity';
import { UpdatePageDto } from './dto/update-page.dto';
import { CreatePageDto } from './dto/create-page.dto';
import { PageStatus } from './entities/page-status.entity';
import { FileDto } from '../file';

@Injectable()
export class PageService {
    constructor(
        @Inject(Page.name)
        private readonly pageRepository: Model<PageDocument>,
        private readonly userService: UserV2Service
    ) {}

    async create(createPageDto: CreatePageDto): Promise<PageDocument> {
        const { userId, url, ...rest } = createPageDto;
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new BadRequestAppError('User not found');
        }
        const existingPage = await this.pageRepository.findOne({ url });
        if (existingPage) {
            throw new ConflictException('Page URL already exists');
        }
        const status: PageStatus = {} as PageStatus;
        if (rest.description) {
            status.descriptionAdded = true;
        }
        const createdPage = new this.pageRepository({
            user,
            url,
            ...rest,
            status
        });
        return createdPage.save();
    }

    async findAll(): Promise<PageDocument[]> {
        return this.pageRepository.find().exec();
    }

    async findForUser(userId: string): Promise<PageDocument> {
        return this.pageRepository
            .findOne({ user: new Types.ObjectId(userId) })
            .exec();
    }

    async findById(id: string): Promise<PageDocument | null> {
        return this.pageRepository.findById(id).exec();
    }

    async update(id: string, updatePageDto: UpdatePageDto) {
        const page = await this.findById(id);
        if (!page) {
            throw new BadRequestAppError('Page not found');
        }
        const status = {};
        if (updatePageDto.description) status['status.descriptionAdded'] = true;

        if (updatePageDto.isPublished !== undefined)
            status['status.isPublished'] = updatePageDto.isPublished;

        console.log({ ...updatePageDto, ...status });

        return this.pageRepository
            .findByIdAndUpdate(
                id,
                { $set: { ...updatePageDto, ...status } },
                { new: true }
            )
            .exec();
    }

    remove(id: string) {
        return this.pageRepository.findByIdAndDelete(id).exec();
    }

    async findOneByUrl(url: string): Promise<PageDocument | null> {
        return this.pageRepository.findOne({ url }).exec();
    }

    async updateIntroVideo(id: string, file: FileDto): Promise<string> {
        const page = await this.findById(id);
        if (!page) {
            throw new BadRequestAppError('Page not found');
        }
        const introVideo = file.getUrl();
        this.pageRepository
            .findByIdAndUpdate(id, { $set: { introVideo } })
            .exec();
        return introVideo;
    }

    async updateProfilePicture(id: string, file: FileDto): Promise<string> {
        const page = await this.findById(id);
        if (!page) {
            throw new BadRequestAppError('Page not found');
        }
        const profilePicture = file.getUrl();
        this.pageRepository
            .findByIdAndUpdate(id, {
                $set: {
                    profilePicture,
                    'status.profilePictureAdded': true
                }
            })
            .exec();
        return profilePicture;
    }

    async updateCover(id: string, file: FileDto): Promise<string> {
        const page = await this.findById(id);
        if (!page) {
            throw new BadRequestAppError('Page not found');
        }
        const coverPicture = file.getUrl();

        this.pageRepository
            .findByIdAndUpdate(id, {
                $set: {
                    coverPicture,
                    'status.coverPictureAdded': true
                }
            })
            .exec();
        return coverPicture;
    }

    async getOrThrow(id: string): Promise<PageDocument> {
        const page = await this.findById(id);
        if (!page) {
            throw new BadRequestAppError('Page not found');
        }
        return page;
    }
}
