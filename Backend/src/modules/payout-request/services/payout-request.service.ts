import {
  Injectable, Inject, ForbiddenException, forwardRef, HttpException
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { PerformerDto } from 'src/modules/performer/dtos';
import { PerformerService } from 'src/modules/performer/services';
import { MailerService } from 'src/modules/mailer';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import {
  EntityNotFoundException,
  QueueEventService,
  QueueEvent
} from 'src/kernel';
import { merge, uniq } from 'lodash';
import { toObjectId } from 'src/kernel/helpers/string.helper';
import * as moment from 'moment';
import { EARNING_MODEL_PROVIDER } from 'src/modules/earning/providers/earning.provider';
import { EarningModel } from 'src/modules/earning/models/earning.model';
import { UserDto } from 'src/modules/user/dtos';
import {
  PAYOUT_REQUEST_CHANEL, PAYOUT_REQUEST_EVENT, SOURCE_TYPE, STATUSES
} from '../constants';
import { DuplicateRequestException, InvalidRequestTokenException } from '../exceptions';
import { PayoutRequestDto } from '../dtos/payout-request.dto';
import {
  PayoutRequestCreatePayload,
  PayoutRequestSearchPayload,
  PayoutRequestUpdatePayload,
  PayoutRequestPerformerUpdatePayload
} from '../payloads/payout-request.payload';
import { PayoutRequestModel } from '../models/payout-request.model';
import { PAYOUT_REQUEST_MODEL_PROVIDER } from '../providers/payout-request.provider';

@Injectable()
export class PayoutRequestService {
  constructor(
    @Inject(EARNING_MODEL_PROVIDER)
    private readonly earningModel: Model<EarningModel>,
    @Inject(PAYOUT_REQUEST_MODEL_PROVIDER)
    private readonly payoutRequestModel: Model<PayoutRequestModel>,
    @Inject(forwardRef(() => QueueEventService))
    private readonly queueEventService: QueueEventService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => MailerService))
    private readonly mailService: MailerService,
    @Inject(forwardRef(() => SettingService))
    private readonly settingService: SettingService
  ) { }

  public async search(
    req: PayoutRequestSearchPayload,
    user?: UserDto
  ): Promise<any> {
    const query = {} as any;
    if (req.sourceId) {
      query.sourceId = toObjectId(req.sourceId);
    }

    if (req.source) {
      query.source = req.source;
    }

    if (req.status) {
      query.status = req.status;
    }

    let sort = {
      updatedAt: -1
    } as any;

    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy]: req.sort
      };
    }

    if (req.fromDate && req.toDate) {
      query.createdAt = {
        $gte: moment(req.fromDate).startOf('day').toDate(),
        $lte: moment(req.toDate).endOf('day').toDate()
      };
    }

    const [data, total] = await Promise.all([
      this.payoutRequestModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(req.limit)
        .skip(req.offset),
      this.payoutRequestModel.countDocuments(query)
    ]);
    const requests = data.map((d) => new PayoutRequestDto(d));
    if (user?.roles?.includes('admin')) {
      const sourceIds = uniq(requests.map((r) => r.sourceId));
      const sources = await this.performerService.findByIds(sourceIds);
      requests.forEach((request: PayoutRequestDto) => {
        const sourceInfo = sources.find((s) => s && s._id.toString() === request.sourceId.toString());
        request.sourceInfo = sourceInfo && new PerformerDto(sourceInfo).toResponse();
      });
    }
    return {
      total,
      data: requests
    };
  }

  public async findById(id: string | object): Promise<any> {
    const request = await this.payoutRequestModel.findById(id);
    return request;
  }

  public async performerCreate(
    payload: PayoutRequestCreatePayload,
    user: UserDto
  ): Promise<PayoutRequestDto> {
    const minimumPayoutAmount = SettingService.getValueByKey(SETTING_KEYS.MINIMUM_PAYOUT_AMOUNT) || 50;
    if (payload.requestTokens < minimumPayoutAmount) {
      throw new HttpException(`Minimum payout amount is $${minimumPayoutAmount} `, 422);
    }
    if (payload.paymentAccountType === 'paypal') {
      const paypalAccount = await this.performerService.getPaymentSetting(user._id, 'paypal');
      if (!paypalAccount?.value?.email) {
        throw new HttpException('You have not provided your Paypal account yet, please try again later', 422);
      }
    }
    if (payload.paymentAccountType === 'banking') {
      const paymentAccountInfo = await this.performerService.getBankInfo(user._id);
      if (!paymentAccountInfo || !paymentAccountInfo.firstName || !paymentAccountInfo.lastName || !paymentAccountInfo.bankAccount) {
        throw new HttpException('Missing banking information', 404);
      }
    }
    const data = {
      ...payload,
      source: SOURCE_TYPE.PERFORMER,
      tokenConversionRate: await this.settingService.getKeyValue(SETTING_KEYS.TOKEN_CONVERSION_RATE) || 1,
      sourceId: user._id,
      updatedAt: new Date(),
      createdAt: new Date()
    } as PayoutRequestModel;

    const query = {
      sourceId: user._id,
      source: SOURCE_TYPE.PERFORMER,
      status: STATUSES.PENDING
    };
    const request = await this.payoutRequestModel.findOne(query);
    if (request) {
      throw new DuplicateRequestException();
    }
    if (user.balance < data.requestTokens) {
      throw new InvalidRequestTokenException();
    }
    const resp = await this.payoutRequestModel.create(data);
    const adminEmail = (await this.settingService.getKeyValue(SETTING_KEYS.ADMIN_EMAIL)) || process.env.ADMIN_EMAIL;
    adminEmail && await this.mailService.send({
      subject: 'New payout request',
      to: adminEmail,
      data: {
        requestAmount: resp.requestTokens,
        paymentAccountType: resp.paymentAccountType,
        requestName: user?.name || user?.username || 'N/A'
      },
      template: 'admin-payout-request'
    });
    return new PayoutRequestDto(resp);
  }

  public async calculate(
    user: UserDto,
    payload?: any
  ): Promise<any> {
    let performerId = user._id;
    if (user.roles && user.roles.includes('admin') && payload.performerId) {
      performerId = payload.performerId;
    }
    const [totalEarnedTokens, previousPaidOutTokens, performer] = await Promise.all([
      this.earningModel.aggregate([
        {
          $match: {
            performerId: toObjectId(performerId)
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$netPrice'
            }
          }
        }
      ]),
      this.payoutRequestModel.aggregate([
        {
          $match: {
            sourceId: toObjectId(performerId),
            status: STATUSES.DONE
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$requestTokens'
            }
          }
        }
      ]),
      this.performerService.findById(toObjectId(performerId))
    ]);

    return {
      totalEarnedTokens: totalEarnedTokens[0]?.total || 0,
      previousPaidOutTokens: previousPaidOutTokens[0]?.total || 0,
      remainingUnpaidTokens: performer.balance || 0
    };
  }

  public async performerUpdate(
    id: string,
    payload: PayoutRequestPerformerUpdatePayload,
    performer: UserDto
  ): Promise<PayoutRequestDto> {
    const payout = await this.payoutRequestModel.findOne({ _id: id });
    if (!payout) {
      throw new EntityNotFoundException();
    }
    // if (payout.status !== 'processing') {
    //   throw new ForbiddenException();
    // }
    if (performer._id.toString() !== payout.sourceId.toString()) {
      throw new ForbiddenException();
    }
    if (payload.paymentAccountType === 'paypal') {
      const paypalAccount = await this.performerService.getPaymentSetting(performer._id, 'paypal');
      if (!paypalAccount?.value?.email) {
        throw new HttpException('You have not provided your Paypal account yet, please try again later', 422);
      }
    }
    if (payload.paymentAccountType === 'banking') {
      const paymentAccountInfo = await this.performerService.getBankInfo(performer._id);
      if (!paymentAccountInfo || !paymentAccountInfo.firstName || !paymentAccountInfo.lastName || !paymentAccountInfo.bankAccount) {
        throw new HttpException('Missing banking information', 404);
      }
    }
    const minimumPayoutAmount = SettingService.getValueByKey(SETTING_KEYS.MINIMUM_PAYOUT_AMOUNT) || 50;
    if (payload.requestTokens < minimumPayoutAmount) {
      throw new HttpException(`Minimum payout amount is $${minimumPayoutAmount} `, 422);
    }
    if (performer.balance < payout.requestTokens) {
      throw new InvalidRequestTokenException();
    }
    merge(payout, payload);
    payout.updatedAt = new Date();
    payout.tokenConversionRate = await this.settingService.getKeyValue(SETTING_KEYS.TOKEN_CONVERSION_RATE) || 1;
    await payout.save();
    // const adminEmail = (await this.settingService.getKeyValue(SETTING_KEYS.ADMIN_EMAIL)) || process.env.ADMIN_EMAIL;
    // adminEmail && await this.mailService.send({
    //   subject: 'New payout request',
    //   to: adminEmail,
    //   data: {
    //     request: payout,
    //     performer
    //   },
    //   template: 'admin-payout-request'
    // });
    return new PayoutRequestDto(payout);
  }

  public async checkPending(user: UserDto) {
    const count = await this.payoutRequestModel.countDocuments({
      sourceId: user._id,
      status: 'pending'
    });
    return {
      valid: count < 1
    };
  }

  public async details(id: string, user: UserDto) {
    const payout = await this.payoutRequestModel.findById(id);
    if (!payout) {
      throw new EntityNotFoundException();
    }

    if (user._id.toString() !== payout.sourceId.toString()) {
      throw new ForbiddenException();
    }

    const data = new PayoutRequestDto(payout);
    data.sourceInfo = new PerformerDto(user).toSearchResponse() || null;
    return data;
  }

  public async adminDetails(id: string) {
    const payout = await this.payoutRequestModel.findById(id);
    if (!payout) {
      throw new EntityNotFoundException();
    }
    const data = new PayoutRequestDto(payout);
    const { sourceId, source, paymentAccountType } = data;
    if (source === SOURCE_TYPE.PERFORMER) {
      const sourceInfo = await this.performerService.findById(sourceId);
      if (sourceInfo) {
        data.sourceInfo = new PerformerDto(sourceInfo).toResponse();
        if (paymentAccountType === 'paypal') {
          data.paymentAccountInfo = await this.performerService.getPaymentSetting(sourceInfo._id, 'paypal');
        }
        if (paymentAccountType === 'banking') {
          data.paymentAccountInfo = await this.performerService.getBankInfo(sourceInfo._id);
        }
      }
    }
    return data;
  }

  public async adminDelete(id: string) {
    const payout = await this.payoutRequestModel.findById(id);
    if (!payout) {
      throw new EntityNotFoundException();
    }
    if ([STATUSES.DONE, STATUSES.REJECTED].includes(payout.status)) {
      throw new ForbiddenException();
    }
    await this.payoutRequestModel.deleteOne({ _id: payout._id });
    return { deleted: true };
  }

  public async adminUpdateStatus(
    id: string | Types.ObjectId,
    payload: PayoutRequestUpdatePayload
  ): Promise<any> {
    const request = await this.payoutRequestModel.findById(id);
    if (!request) {
      throw new EntityNotFoundException();
    }

    const oldStatus = request.status;
    merge(request, payload);
    request.updatedAt = new Date();
    await request.save();

    const event: QueueEvent = {
      channel: PAYOUT_REQUEST_CHANEL,
      eventName: PAYOUT_REQUEST_EVENT.UPDATED,
      data: {
        request,
        oldStatus
      }
    };
    await this.queueEventService.publish(event);
    return request;
  }
}
