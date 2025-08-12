import { QueueEvent, QueueEventService } from 'src/kernel';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import {
  PerformerService
} from 'src/modules/performer/services';
import { EVENT } from 'src/kernel/constants';
import { MailerService } from 'src/modules/mailer';
// import { SettingService } from 'src/modules/settings/services';
import { UserService } from 'src/modules/user/services';
import { SettingService } from 'src/modules/settings';
import {
  TOKEN_TRANSACTION_SUCCESS_CHANNEL,
  PURCHASE_ITEM_STATUS,
  PURCHASE_ITEM_TYPE
} from '../constants';
import { TokenTransactionDto } from '../dtos';

const HANDLE_MAILER_TOPIC = 'HANDLE_MAILER_TOPIC';

@Injectable()
export class PaymentTokenListener {
  constructor(
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly mailService: MailerService,
    private readonly queueEventService: QueueEventService
  ) {
    this.queueEventService.subscribe(
      TOKEN_TRANSACTION_SUCCESS_CHANNEL,
      HANDLE_MAILER_TOPIC,
      this.handleMailerTransaction.bind(this)
    );
  }

  public async handleMailerTransaction(event: QueueEvent) {
    if (![EVENT.CREATED, EVENT.DELETED].includes(event.eventName)) {
      return;
    }
    const transaction = event.data as TokenTransactionDto;
    // TOTO handle more event transaction
    if (transaction.status !== PURCHASE_ITEM_STATUS.SUCCESS) {
      return;
    }
    if ([PURCHASE_ITEM_TYPE.PRIVATE_CHAT, PURCHASE_ITEM_TYPE.PUBLIC_CHAT, PURCHASE_ITEM_TYPE.GROUP_CHAT].includes(transaction.type)) {
      return;
    }
    const adminEmail = await SettingService.getByKey('adminEmail').value || process.env.ADMIN_EMAIL;
    const performer = await this.performerService.findById(transaction.performerId);
    const user = await this.userService.findById(transaction.sourceId);
    // mail to performer
    if (performer && performer.email) {
      if ([PURCHASE_ITEM_TYPE.TIP, PURCHASE_ITEM_TYPE.STREAM_TIP].includes(transaction.type)) {
        await this.mailService.send({
          subject: 'You have a Tip',
          to: performer.email,
          data: {
            performerName: performer?.name || performer?.username,
            userName: user?.name || user?.username,
            tipAmount: transaction.totalPrice
          },
          template: 'performer-tip-success'
        });
      } else {
        await this.mailService.send({
          subject: 'New Wallet Purchased Success',
          to: performer.email,
          data: {
            performer,
            user,
            transactionId: transaction._id.toString().slice(16, 24).toUpperCase()
          },
          template: 'performer-payment-success'
        });
      }
    }
    // mail to admin
    if (adminEmail) {
      await this.mailService.send({
        subject: 'New Wallet Purchased Success',
        to: adminEmail,
        data: {
          performerName: performer?.name || performer?.username || `${performer?.firstName} ${performer?.lastName}`,
          userName: user?.name || user?.username || `${user?.firstName} ${user?.lastName}`,
          transactionId: transaction._id.toString().slice(16, 24).toUpperCase()
        },
        template: 'admin-payment-success'
      });
    }
    // // mail to user
    if (user && user.email) {
      await this.mailService.send({
        subject: 'New Wallet Purchased Success',
        to: user.email,
        data: {
          userName: user?.name || user?.username || `${user?.firstName} ${user?.lastName}`,
          transactionId: transaction._id.toString().slice(16, 24).toUpperCase()
        },
        template: 'user-payment-success'
      });
    }
  }
}
