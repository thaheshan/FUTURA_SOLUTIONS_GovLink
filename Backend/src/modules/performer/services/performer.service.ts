/* eslint-disable no-param-reassign */
import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import {
  EntityNotFoundException,
  ForbiddenException,
  QueueEvent,
  QueueEventService,
  StringHelper
} from 'src/kernel';
import { EVENT, STATUS } from 'src/kernel/constants';
import {
  isObjectId,
  randomString,
  toObjectId
} from 'src/kernel/helpers/string.helper';
import { AuthService } from 'src/modules/auth/services';
import { PerformerBlockService } from 'src/modules/block/services';
import { FileDto } from 'src/modules/file';
import { REF_TYPE } from 'src/modules/file/constants';
import { FILE_EVENT, FileService } from 'src/modules/file/services';
import { FollowService } from 'src/modules/follow/services/follow.service';
import { MailerService } from 'src/modules/mailer';
import {
  DELETE_PERFORMER_CHANNEL,
  PERFORMER_STATUSES,
  PERFORMER_UPDATE_STATUS_CHANNEL
} from 'src/modules/performer/constants';
import { REACTION, REACTION_TYPE } from 'src/modules/reaction/constants';
import { ReactionService } from 'src/modules/reaction/services/reaction.service';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { Storage } from 'src/modules/storage/contants';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { UserDto } from 'src/modules/user/dtos';
import { UserService } from 'src/modules/user/services';
import { PerformerDto } from '../dtos';
import { EmailExistedException, UsernameExistedException } from '../exceptions';
import {
  BankingModel,
  PaymentGatewaySettingModel,
  PerformerModel
} from '../models';
import {
  BankingSettingPayload,
  CommissionSettingPayload,
  PaymentGatewaySettingPayload,
  PerformerCreatePayload,
  PerformerRegisterPayload,
  PerformerUpdatePayload,
  SelfUpdatePayload
} from '../payloads';
import {
  PERFORMER_BANKING_SETTING_MODEL_PROVIDER,
  PERFORMER_MODEL_PROVIDER,
  PERFORMER_PAYMENT_GATEWAY_SETTING_MODEL_PROVIDER
} from '../providers';

const defaultUserName = `creator-${randomString(8, '0123456789')}`;

interface WelcomeVideo extends QueueEvent {
    data: {
        fileId: string;
        meta: {
            performerId: string;
        };
    };
}

@Injectable()
export class PerformerService {
    constructor(
        @Inject(forwardRef(() => FollowService))
        private readonly followService: FollowService,
        @Inject(forwardRef(() => PerformerBlockService))
        private readonly performerBlockService: PerformerBlockService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        @Inject(forwardRef(() => ReactionService))
        private readonly reactionService: ReactionService,
        @Inject(forwardRef(() => SettingService))
        private readonly settingService: SettingService,
        @Inject(forwardRef(() => FileService))
        private readonly fileService: FileService,
        @Inject(forwardRef(() => SubscriptionService))
        private readonly subscriptionService: SubscriptionService,
        @Inject(PERFORMER_MODEL_PROVIDER)
        private readonly performerModel: Model<PerformerModel>,
        private readonly queueEventService: QueueEventService,
        private readonly mailService: MailerService,
        @Inject(PERFORMER_PAYMENT_GATEWAY_SETTING_MODEL_PROVIDER)
        private readonly paymentGatewaySettingModel: Model<PaymentGatewaySettingModel>,
        @Inject(PERFORMER_BANKING_SETTING_MODEL_PROVIDER)
        private readonly bankingSettingModel: Model<BankingModel>
    ) {
        this.queueEventService.subscribe(
            'CONVERT_WELCOME_VIDEO_CHANNEL',
            'FILE_PROCESSED_TOPIC',
            this.handleWelcomeVideoFile.bind(this)
        );
    }

    public async handleWelcomeVideoFile(event: WelcomeVideo) {
        const { eventName } = event;
        if (eventName !== FILE_EVENT.VIDEO_PROCESSED) {
            return;
        }
        const { performerId } = event.data.meta;
        const [performer, file] = await Promise.all([
            this.performerModel.findById(performerId),
            this.fileService.findById(event.data.fileId)
        ]);
        if (!performer) {
            // TODO - delete file?
            await this.fileService.remove(event.data.fileId);
            return;
        }

        performer.welcomeVideoPath = file.getUrl();
        await performer.save();
    }

    public async checkExistedEmailorUsername(payload) {
        const data = payload.username ?
            await this.performerModel.countDocuments({
                  username: payload.username.trim().toLowerCase()
              }) :
            await this.performerModel.countDocuments({
                  email: payload.email.toLowerCase()
              });
        return data;
    }

    public async findById(id: string | Types.ObjectId): Promise<PerformerDto> {
        const model = await this.performerModel.findById(id);
        if (!model) return null;
        return new PerformerDto(model);
    }

    public async findOne(query) {
        const data = await this.performerModel.findOne(query);
        return data;
    }

    public async find(query) {
        const data = await this.performerModel.find(query);
        return data;
    }

    public async updateOne(
        query: any,
        params: any,
        options: any
    ): Promise<any> {
        return this.performerModel.updateOne(query, params, options);
    }

    public async findByUsername(
        username: string,
        countryCode?: string,
        user?: UserDto
    ): Promise<PerformerDto> {
        const query = !isObjectId(username) ?
            {
                  username: username.trim()
              } :
            { _id: username };
        let model = (await this.performerModel.findOne(query).lean()) as any;
        // if (!model) throw new EntityNotFoundException();
        if (!model) {
            const foundUser = isObjectId(username) ?
                await this.userService.findById(username) :
                await this.userService.findByUsername(username);
            console.log('performer.service.ts', 'findByUsername', {
                foundUser
            });
            const auth = await this.authService.findBySource({
                source: 'user',
                sourceId: foundUser._id
            });
            console.log('performer.service.ts', 'findByUsername', { auth });
            const performer = await this.performerModel
                .findOne({ _id: auth.performerId })
                .lean();
            model = { ...performer, ...foundUser };
            // throw new EntityNotFoundException()
        }
        let isBlocked = false;
        if (
            countryCode &&
            `${user?._id}` !== `${model._id}` &&
            !user?.isPerformer
        ) {
            isBlocked =
                await this.performerBlockService.checkBlockedCountryByIp(
                    model._id,
                    countryCode
                );
            if (isBlocked) {
                throw new HttpException(
                    'Your country has been blocked by this creator',
                    403
                );
            }
        }
        const dto = new PerformerDto(model);
        let isBlockedByPerformer = false;
        let isBookMarked = null;
        let isSubscribed = null;
        let isFollowed = null;
        if (user) {
            isBlockedByPerformer =
                `${user?._id}` !== `${model._id}` &&
                !user?.isPerformer &&
                (await this.performerBlockService.checkBlockedByPerformer(
                    model._id,
                    user._id
                ));
            if (isBlockedByPerformer)
                throw new HttpException(
                    'You has been blocked by this creator',
                    403
                );
            isBookMarked = await this.reactionService.findOneQuery({
                objectType: REACTION_TYPE.PERFORMER,
                objectId: model._id,
                createdBy: user._id,
                action: REACTION.BOOKMARK
            });
            const [subscription, following] = await Promise.all([
                this.subscriptionService.findOneSubscription({
                    performerId: model._id,
                    userId: user._id
                }),
                this.followService.findOne({
                    followerId: user._id,
                    followingId: model._id
                })
            ]);
            if (subscription) {
                isSubscribed = moment().isBefore(subscription.expiredAt);
                if (subscription.usedFreeSubscription) {
                    dto.isFreeSubscription = false;
                }
            }
            isFollowed = following;
            isSubscribed =
                (subscription && moment().isBefore(subscription.expiredAt)) ||
                false;
        }
        dto.isSubscribed = !!isSubscribed;
        dto.isBookMarked = !!isBookMarked;
        dto.isFollowed = !!isFollowed;
        if (user && user.roles && user.roles.includes('admin')) {
            dto.isSubscribed = true;
        }
        if (model.welcomeVideoId) {
            const welcomeVideo = await this.fileService.findById(
                model.welcomeVideoId
            );
            dto.welcomeVideoPath = welcomeVideo ? welcomeVideo.getUrl() : '';
            dto.welcomeVideoPath &&
                (await this.performerModel.updateOne(
                    { _id: model._id },
                    { welcomeVideoPath: dto.welcomeVideoPath }
                ));
        }
        await this.increaseViewStats(dto._id);
        return dto;
    }

    public async findByEmail(email: string): Promise<PerformerDto> {
        if (!email) {
            return null;
        }
        const model = await this.performerModel.findOne({
            email: email.toLowerCase()
        });
        if (!model) return null;
        return new PerformerDto(model);
    }

    public async findByIds(ids: any[]): Promise<PerformerDto[]> {
        const performers = await this.performerModel
            .find({
                _id: {
                    $in: ids
                }
            })
            .lean()
            .exec();
        return performers.map((p) => new PerformerDto(p));
    }

    public async getDetails(
        id: string,
        jwToken: string
    ): Promise<PerformerDto> {
        const performer = await this.performerModel.findById(id);
        if (!performer) {
            throw new EntityNotFoundException();
        }
        const [documentVerification, idVerification, welcomeVideo] =
            await Promise.all([
                performer.documentVerificationId &&
                    this.fileService.findById(performer.documentVerificationId),
                performer.idVerificationId &&
                    this.fileService.findById(performer.idVerificationId),
                performer.welcomeVideoId &&
                    this.fileService.findById(performer.welcomeVideoId)
            ]);
        const [
            paypalSetting,
            blockCountries,
            bankingInformation,
            ccbillSetting
        ] = await Promise.all([
            this.paymentGatewaySettingModel.findOne({
                performerId: id,
                key: 'paypal'
            }),
            this.performerBlockService.findOneBlockCountriesByQuery({
                sourceId: id
            }),
            this.getBankInfo(performer._id),
            this.paymentGatewaySettingModel.findOne({
                performerId: id,
                key: 'ccbill'
            })
        ]);

        // TODO - update kernel for file dto
        const dto = new PerformerDto(performer);
        dto.avatar = dto.avatarPath ?
            FileDto.getPublicUrl(dto.avatarPath) :
            null; // TODO - get default avatar
        dto.cover = dto.coverPath ? FileDto.getPublicUrl(dto.coverPath) : null;
        dto.welcomeVideoName = welcomeVideo ? welcomeVideo.name : null;
        dto.welcomeVideoPath = welcomeVideo ? welcomeVideo.getUrl() : null;
        if (idVerification) {
            let fileUrl = idVerification.getUrl(true);
            if (idVerification.server !== Storage.S3) {
                fileUrl = `${fileUrl}?performerId=${performer._id}&token=${jwToken}`;
            }
            dto.idVerification = {
                _id: idVerification._id,
                url: fileUrl,
                mimeType: idVerification.mimeType
            };
        }
        if (documentVerification) {
            let fileUrl = documentVerification.getUrl(true);
            if (documentVerification.server !== Storage.S3) {
                fileUrl = `${fileUrl}?performerId=${performer._id}&token=${jwToken}`;
            }
            dto.documentVerification = {
                _id: documentVerification._id,
                url: fileUrl,
                mimeType: documentVerification.mimeType
            };
        }
        dto.paypalSetting = paypalSetting;
        dto.blockCountries = blockCountries;
        dto.bankingInformation = bankingInformation;
        dto.ccbillSetting = ccbillSetting;
        return dto;
    }

    public async delete(id: string) {
        if (!StringHelper.isObjectId(id)) throw new ForbiddenException();
        const performer = await this.performerModel.findById(id);
        if (!performer) throw new EntityNotFoundException();
        await this.performerModel.deleteOne({ _id: id });
        await this.queueEventService.publish(
            new QueueEvent({
                channel: DELETE_PERFORMER_CHANNEL,
                eventName: EVENT.DELETED,
                data: new PerformerDto(performer).toResponse()
            })
        );
        return { deleted: true };
    }

    public async create(
        payload: PerformerCreatePayload
    ): Promise<PerformerDto> {
        const data = {
            ...payload,
            updatedAt: new Date(),
            createdAt: new Date()
        } as any;
        const countPerformerUsername = await this.performerModel.countDocuments(
            {
                username: payload.username.trim().toLowerCase()
            }
        );
        const countUserUsername =
            await this.userService.checkExistedEmailorUsername({
                username: payload.username
            });
        if (countPerformerUsername || countUserUsername) {
            throw new UsernameExistedException();
        }

        const countPerformerEmail = await this.performerModel.countDocuments({
            email: payload.email.toLowerCase()
        });
        const countUserEmail =
            await this.userService.checkExistedEmailorUsername({
                email: payload.email
            });
        if (countPerformerEmail || countUserEmail) {
            throw new EmailExistedException();
        }

        data.username = data.username ?
            data.username.trim().toLowerCase() :
            defaultUserName;
        data.email = data.email.toLowerCase();
        if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        if (!data.name) {
            data.name =
                data.firstName && data.lastName ?
                    [data.firstName, data.lastName].join(' ') :
                    data.username;
        }

        data.commissionPercentage = SettingService.getValueByKey(
            SETTING_KEYS.PERFORMER_COMMISSION
        );
        data.isFreeSubscription =
            SettingService.getValueByKey(
                SETTING_KEYS.FREE_SUBSCRIPTION_ENABLED
            ) || true;
        data.durationFreeSubscriptionDays =
            SettingService.getValueByKey(
                SETTING_KEYS.FREE_SUBSCRIPTION_DURATION
            ) || 1;
        const performer = await this.performerModel.create(data);

        // TODO - fire event?
        return new PerformerDto(performer);
    }

    public async register(
        payload: PerformerRegisterPayload
    ): Promise<PerformerDto> {
        console.log('performer.service.ts: register: payload: ', payload);
        const data = omit(
            {
                ...payload,
                status: PERFORMER_STATUSES.ACTIVE,
                updatedAt: new Date(),
                createdAt: new Date()
            },
            ['balance', 'commissionPercentage']
        ) as any;
        console.log('performer.service.ts', '2');
        // const countPerformerUsername = await this.performerModel.countDocuments({
        //   username: payload.username.trim().toLowerCase()
        // });
        // const countUserUsername = await this.userService.checkExistedEmailorUsername({ username: payload.username });
        // if (countPerformerUsername || countUserUsername) {
        //   throw new UsernameExistedException();
        // }

        // const countPerformerEmail = await this.performerModel.countDocuments({
        //   email: payload.email.toLowerCase()
        // });
        // const countUserEmail = await this.userService.checkExistedEmailorUsername({ email: payload.email });
        // if (countPerformerEmail || countUserEmail) {
        //   throw new EmailExistedException();
        // }

        // if (payload.avatarId) {
        //   const avatar = await this.fileService.findById(payload.avatarId);
        //   if (avatar) {
        //     data.avatarPath = avatar.path;
        //   }
        // }
        // data.username = data.username ? data.username.trim().toLowerCase() : defaultUserName;
        data.email = '';
        // if (!data.name) {
        //   data.name = data.firstName && data.lastName ? [data.firstName, data.lastName].join(' ') : data.username;
        // }
        // if (data.dateOfBirth) {
        //   data.dateOfBirth = new Date(data.dateOfBirth);
        // }
        console.log('performer.service.ts', '3.0');
        data.commissionPercentage = SettingService.getValueByKey(
            SETTING_KEYS.PERFORMER_COMMISSION
        );
        console.log('performer.service.ts', '3.1');
        data.isFreeSubscription =
            SettingService.getValueByKey(
                SETTING_KEYS.FREE_SUBSCRIPTION_ENABLED
            ) || true;
        console.log('performer.service.ts', '3.2');
        data.durationFreeSubscriptionDays =
            SettingService.getValueByKey(
                SETTING_KEYS.FREE_SUBSCRIPTION_DURATION
            ) || 1;
        console.log('performer.service.ts', '3.3');
        const performer = await this.performerModel.create(data);
        console.log('performer.service.ts', '4');

        // await Promise.all([
        //   payload.idVerificationId
        //   && this.fileService.addRef(payload.idVerificationId, {
        //     itemId: performer._id as any,
        //     itemType: REF_TYPE.PERFORMER
        //   }),
        //   payload.documentVerificationId
        //   && this.fileService.addRef(payload.documentVerificationId, {
        //     itemId: performer._id as any,
        //     itemType: REF_TYPE.PERFORMER
        //   })
        // payload.avatarId && this.fileService.addRef(payload.avatarId, {
        //   itemId: performer._id as any,
        //   itemType: REF_TYPE.PERFORMER
        // })
        // ]);
        // const adminEmail = await SettingService.getValueByKey(SETTING_KEYS.ADMIN_EMAIL);
        // adminEmail && await this.mailService.send({
        //   subject: 'New performer sign up',
        //   to: adminEmail,
        //   data: { performer },
        //   template: 'new-performer-notify-admin'
        // });

        // TODO - fire event?
        return new PerformerDto(performer);
    }

    public async adminUpdate(
        id: string,
        payload: PerformerUpdatePayload
    ): Promise<any> {
        const performer = await this.performerModel.findById(id);
        if (!performer) {
            throw new EntityNotFoundException();
        }

        const data = { ...payload } as any;
        if (!data.name) {
            data.name =
                data.firstName && data.lastName ?
                    [data.firstName, data.lastName].join(' ') :
                    data.username;
        }
        // check duplicated email
        if (data.email) {
            data.email = data.email.toLowerCase();
            if (data.email !== performer.email) {
                const [emailCheck, countUserEmail] = await Promise.all([
                    this.performerModel.countDocuments({
                        email: data.email,
                        _id: { $ne: performer._id }
                    }),
                    this.userService.checkExistedEmailorUsername({
                        email: data.email
                    })
                ]);
                if (emailCheck || countUserEmail) {
                    throw new EmailExistedException();
                }
            }
        }
        // check duplicated username

        if (data.username) {
            data.username = data.username.trim().toLowerCase();
            if (data.username !== performer.username) {
                const [usernameCheck, countUserUsername] = await Promise.all([
                    this.performerModel.countDocuments({
                        username: data.username,
                        _id: { $ne: performer._id }
                    }),
                    this.userService.checkExistedEmailorUsername({
                        username: data.username
                    })
                ]);
                if (usernameCheck || countUserUsername) {
                    throw new UsernameExistedException();
                }
            }
        }
        if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        await this.performerModel.updateOne({ _id: id }, data);
        const newPerformer = await this.performerModel.findById(performer._id);
        const oldVerifiedDocument = performer.verifiedDocument;
        // fire event that updated performer status
        if (
            oldVerifiedDocument !== newPerformer.verifiedDocument &&
            newPerformer.verifiedDocument
        ) {
            await this.queueEventService.publish(
                new QueueEvent({
                    channel: PERFORMER_UPDATE_STATUS_CHANNEL,
                    eventName: EVENT.UPDATED,
                    data: {
                        ...new PerformerDto(newPerformer),
                        oldVerifiedDocument
                    }
                })
            );
        }
        if (newPerformer.email && performer.email !== newPerformer.email) {
            await this.authService.sendVerificationEmail(newPerformer);
            await this.authService.updateKey({
                source: 'performer',
                sourceId: newPerformer._id,
                key: newPerformer.email
            });
        }
        return new PerformerDto(newPerformer).toResponse(true);
    }

    public async selfUpdate(
        id: string,
        payload: SelfUpdatePayload
    ): Promise<boolean> {
        const performer = await this.performerModel.findById(id);
        if (!performer) {
            throw new EntityNotFoundException();
        }

        const data = omit(payload, ['balance', 'commissionPercentage']) as any;
        if (!data.name) {
            data.name =
                data.firstName && data.lastName ?
                    [data.firstName, data.lastName].join(' ') :
                    data.username;
        }
        // check duplicated email

        if (data.email) {
            data.email = data.email.toLowerCase();
            if (data.email !== performer.email) {
                const [emailCheck, countUserEmail] = await Promise.all([
                    this.performerModel.countDocuments({
                        email: data.email,
                        _id: { $ne: performer._id }
                    }),
                    this.userService.checkExistedEmailorUsername({
                        email: data.email
                    })
                ]);
                if (emailCheck || countUserEmail) {
                    throw new EmailExistedException();
                }
            }
        }
        // check duplicated username

        if (data.username) {
            data.username = data.username.trim().toLowerCase();
            if (data.username !== performer.username) {
                const [usernameCheck, countUserUsername] = await Promise.all([
                    this.performerModel.countDocuments({
                        username: data.username,
                        _id: { $ne: performer._id }
                    }),
                    this.userService.checkExistedEmailorUsername({
                        username: data.username
                    })
                ]);
                if (usernameCheck || countUserUsername) {
                    throw new UsernameExistedException();
                }
            }
        }
        if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        await this.performerModel.updateOne({ _id: id }, data);
        const newPerformer = await this.performerModel.findById(id);
        if (newPerformer.email && performer.email !== newPerformer.email) {
            await this.authService.sendVerificationEmail(newPerformer);
            await this.authService.updateKey({
                source: 'performer',
                sourceId: newPerformer._id,
                key: newPerformer.email
            });
        }
        return true;
    }

    public async socialCreate(
        payload: PerformerRegisterPayload
    ): Promise<PerformerModel> {
        const data = omit(
            {
                ...payload,
                updatedAt: new Date(),
                createdAt: new Date()
            },
            ['balance', 'commissionPercentage']
        ) as any;
        if (!data.name) {
            // eslint-disable-next-line no-param-reassign
            data.name = [data.firstName || '', data.lastName || ''].join(' ');
        }
        if (payload.username) {
            const [countPerformerUsername, countUserUsername] =
                await Promise.all([
                    this.performerModel.countDocuments({
                        username: payload.username
                    }),
                    this.userService.checkExistedEmailorUsername({
                        username: payload.username
                    })
                ]);
            if (countPerformerUsername || countUserUsername) {
                data.username = `model${StringHelper.randomString(
                    8,
                    '0123456789'
                )}`;
            }
        }
        if (payload.email) {
            const [countPerformerEmail, countUserEmail] = await Promise.all([
                this.performerModel.countDocuments({
                    email: payload.email
                }),
                this.userService.checkExistedEmailorUsername({
                    email: payload.email
                })
            ]);
            if (countPerformerEmail || countUserEmail) {
                data.email = null;
                data.verifiedEmail = false;
            }
        }
        return this.performerModel.create(data);
    }

    public async updateDocument(
        performerId: string | Types.ObjectId,
        file: FileDto,
        type: string
    ) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer) throw new EntityNotFoundException();
        const data =
            type === 'idVerificationId' ?
                {
                      idVerificationId: file._id
                  } :
                {
                      documentVerificationId: file._id
                  };
        await this.performerModel.updateOne({ _id: performerId }, data);
        await this.fileService.addRef(file._id, {
            itemId: toObjectId(performerId),
            itemType: REF_TYPE.PERFORMER
        });
        if (
            type === 'idVerificationId' &&
            performer.idVerificationId &&
            `${performer.idVerificationId}` !== `${file._id}`
        ) {
            await this.fileService.remove(performer.idVerificationId);
        }
        if (
            type === 'documentVerificationId' &&
            performer.documentVerificationId &&
            `${performer.documentVerificationId}` !== `${file._id}`
        ) {
            await this.fileService.remove(performer.documentVerificationId);
        }
        return file;
    }

    public async updateAvatar(
        performerId: string | Types.ObjectId,
        file: FileDto
    ) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer) throw new EntityNotFoundException();
        await this.performerModel.updateOne(
            { _id: performerId },
            {
                avatarId: file._id,
                avatarPath: file.path
            }
        );
        await this.fileService.addRef(file._id, {
            itemId: toObjectId(performerId),
            itemType: REF_TYPE.PERFORMER
        });

        if (performer.avatarId && `${performer.avatarId}` !== `${file._id}`) {
            await this.fileService.remove(performer.avatarId);
        }
        return file;
    }

    public async updateCover(
        performerId: string | Types.ObjectId,
        file: FileDto
    ) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer) throw new EntityNotFoundException();
        await this.performerModel.updateOne(
            { _id: performerId },
            {
                coverId: file._id,
                coverPath: file.path
            }
        );
        await this.fileService.addRef(file._id, {
            itemId: toObjectId(performerId),
            itemType: REF_TYPE.PERFORMER
        });
        if (performer.coverId && `${performer.coverId}` !== `${file._id}`) {
            await this.fileService.remove(performer.coverId);
        }
        return file;
    }

    public async updateWelcomeVideo(
        performerId: string | Types.ObjectId,
        file: FileDto
    ) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer) throw new EntityNotFoundException();
        await this.performerModel.updateOne(
            { _id: performerId },
            {
                welcomeVideoId: file._id,
                welcomeVideoPath: file.path
            }
        );

        await this.fileService.addRef(file._id, {
            itemId: toObjectId(performerId),
            itemType: REF_TYPE.PERFORMER
        });

        if (
            performer.welcomeVideoId &&
            `${performer.welcomeVideoId}` !== `${file._id}`
        ) {
            await this.fileService.remove(performer.welcomeVideoId);
        }
        await this.fileService.queueProcessVideo(file._id, {
            publishChannel: 'CONVERT_WELCOME_VIDEO_CHANNEL',
            meta: {
                performerId
            }
        });
        return file;
    }

    public async getBankInfo(performerId) {
        const data = await this.bankingSettingModel.findOne({
            performerId
        });
        return data;
    }

    public async increaseViewStats(id: string | Types.ObjectId) {
        await this.performerModel.updateOne(
            { _id: id },
            {
                $inc: { 'stats.views': 1 }
            }
        );
    }

    public async updateLastStreamingTime(
        id: string | Types.ObjectId,
        streamTime: number
    ) {
        await this.performerModel.updateOne(
            { _id: id },
            {
                $inc: { 'stats.totalStreamTime': streamTime },
                lastStreamingTime: new Date(),
                live: 0,
                streamingStatus: 'offline'
            }
        );
    }

    public async updateStats(
        id: string | Types.ObjectId,
        payload: Record<string, number>
    ) {
        await this.performerModel.updateOne({ _id: id }, { $inc: payload });
    }

    public async goLive(id: string | Types.ObjectId) {
        await this.performerModel.updateOne({ _id: id }, { $set: { live: 1 } });
    }

    public async setStreamingStatus(
        id: string | Types.ObjectId,
        streamingStatus: string
    ) {
        await this.performerModel.updateOne(
            { _id: id },
            { $set: { streamingStatus } }
        );
    }

    public async updatePaymentGateway(payload: PaymentGatewaySettingPayload) {
        let item = await this.paymentGatewaySettingModel.findOne({
            key: payload.key,
            performerId: payload.performerId
        });
        if (!item) {
            // eslint-disable-next-line new-cap
            item = new this.paymentGatewaySettingModel();
        }
        item.key = payload.key;
        item.performerId = payload.performerId as any;
        item.status = 'active';
        item.value = payload.value;
        return item.save();
    }

    public async getPaymentSetting(
        performerId: string | Types.ObjectId,
        service = 'ccbill'
    ) {
        return this.paymentGatewaySettingModel.findOne({
            key: service,
            performerId
        });
    }

    public async updateSubscriptionStat(
        performerId: string | Types.ObjectId,
        num = 1
    ) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer) return;
        const minimumVerificationNumber =
            (await this.settingService.getKeyValue(
                SETTING_KEYS.PERFORMER_VERIFY_NUMBER
            )) || 5;
        const verifiedAccount =
            num === 1 ?
                performer.stats.subscribers >= minimumVerificationNumber - 1 :
                performer.stats.subscribers - 1 < minimumVerificationNumber;
        await this.performerModel.updateOne(
            { _id: performerId },
            {
                $inc: { 'stats.subscribers': num },
                verifiedAccount
            }
        );
    }

    public async updateLikeStat(performerId: string | Types.ObjectId, num = 1) {
        await this.performerModel.updateOne(
            { _id: performerId },
            {
                $inc: { 'stats.likes': num }
            }
        );
    }

    public async updateCommissionSetting(
        performerId: string,
        payload: CommissionSettingPayload
    ) {
        await this.performerModel.updateOne(
            { _id: performerId },
            {
                commissionPercentage: payload.commissionPercentage
            }
        );
    }

    public async updateBankingSetting(
        performerId: string,
        payload: BankingSettingPayload,
        user: UserDto
    ) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer) throw new EntityNotFoundException();
        if (
            user?.roles &&
            !user?.roles.includes('admin') &&
            `${user._id}` !== `${performerId}`
        ) {
            throw new HttpException('Permission denied', 403);
        }
        let item = await this.bankingSettingModel.findOne({
            performerId
        });
        if (!item) {
            // eslint-disable-next-line new-cap
            item = new this.bankingSettingModel(payload);
        }
        item.performerId = performerId as any;
        item.firstName = payload.firstName;
        item.lastName = payload.lastName;
        item.SSN = payload.SSN;
        item.bankName = payload.bankName;
        item.bankAccount = payload.bankAccount;
        item.bankRouting = payload.bankRouting;
        item.bankSwiftCode = payload.bankSwiftCode;
        item.address = payload.address;
        item.city = payload.city;
        item.state = payload.state;
        item.country = payload.country;
        return item.save();
    }

    public async updateVerificationStatus(
        userId: string | Types.ObjectId
    ): Promise<any> {
        return this.performerModel.updateOne(
            {
                _id: userId
            },
            { status: STATUS.ACTIVE, verifiedEmail: true }
        );
    }

    public async updateEmailVerificationStatus(
        userId: string | Types.ObjectId,
        verifiedEmail = true
    ): Promise<any> {
        return this.performerModel.updateOne(
            {
                _id: userId
            },
            { verifiedEmail }
        );
    }

    public async updatePerformerBalance(
        performerId: string | Types.ObjectId,
        tokens: number
    ) {
        await this.performerModel.updateOne(
            { _id: performerId },
            { $inc: { balance: tokens } }
        );
    }

    public async updatePerformerCategory(categoryId: Types.ObjectId) {
        await this.performerModel.updateMany(
            {
                categoryIds: { $in: categoryId }
            },
            {
                $pull: { categoryIds: categoryId }
            }
        );
    }

    public async checkAuthDocument(req: any, user: UserDto) {
        const { query } = req;
        if (user.roles && user.roles.indexOf('admin') > -1) {
            return true;
        }
        if (query.performerId === `${user._id}`) return true;
        throw new ForbiddenException();
    }

    public async getSpecialRequestDescription(
        performerId: string | Types.ObjectId
    ) {
        console.log('performer.service.ts', 'getSpecialRequestDescription', {
            performerId
        });
        const performer = await this.performerModel.findById(performerId);
        console.log('performer.service.ts', 'getSpecialRequestDescription', {
            performer
        });
        if (!performer) throw new EntityNotFoundException();
        return {
            specialRequestDescription:
                performer.specialRequestDescription || 'test remove this'
        };
    }

    public async updateSpecialRequestDescription(
        performerId: string | Types.ObjectId,
        description: string
    ) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer) throw new EntityNotFoundException();
        console.log('performer.service.ts', 'updateSpecialRequestDescription', {
            performer,
            description
        });
        await this.performerModel.updateOne(
            { _id: performerId },
            { specialRequestDescription: description }
        );
        const performerU = await this.performerModel.findById(performerId);
        console.log('performer.service.ts', 'updateSpecialRequestDescription', {
            performerU
        });
        return true;
    }
}
