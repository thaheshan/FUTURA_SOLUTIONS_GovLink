import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { MailerService } from 'src/modules/mailer';
import {
    PAYOUT_REQUEST_CHANEL,
    PAYOUT_REQUEST_EVENT,
    SOURCE_TYPE,
    STATUSES
} from '../constants';

const PAYOUT_REQUEST_UPDATE = 'PAYOUT_REQUEST_UPDATE';

interface PayoutRequest extends QueueEvent {
    data: {
        request: {
            source: string;
        };
        oldStatus: string;
    };
}

@Injectable()
export class UpdatePayoutRequestListener {
    constructor(
        @Inject(forwardRef(() => QueueEventService))
        private readonly queueEventService: QueueEventService,
        @Inject(forwardRef(() => MailerService))
        private readonly mailService: MailerService,
        @Inject(forwardRef(() => PerformerService))
        private readonly performerService: PerformerService
    ) {
        this.queueEventService.subscribe(
            PAYOUT_REQUEST_CHANEL,
            PAYOUT_REQUEST_UPDATE,
            this.handler.bind(this)
        );
    }

    async handler(event: PayoutRequest) {
        const {request} = event.data;
        const { source } = request;
        if (event.eventName === PAYOUT_REQUEST_EVENT.UPDATED) {
            if (source === SOURCE_TYPE.PERFORMER) {
                await this.handlePerformer(request, event.data.oldStatus);
            }
        }
    }

    private async handlePerformer(request, oldStatus) {
        const { status, sourceId, requestTokens } = request;
        const sourceInfo = await this.performerService.findById(sourceId);
        if (!sourceInfo) {
            return;
        }
        if (status === STATUSES.DONE && oldStatus === STATUSES.PENDING) {
            await this.performerService.updatePerformerBalance(
                sourceId,
                -requestTokens
            );
        }

        if (sourceInfo.email) {
            await this.mailService.send({
                subject: 'Update payout request',
                to: sourceInfo.email,
                data: { request },
                template: 'payout-request-status'
            });
        }
    }
}
