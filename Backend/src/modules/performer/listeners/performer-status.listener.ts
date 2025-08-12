import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { MailerService } from 'src/modules/mailer/services';
import { PERFORMER_UPDATE_STATUS_CHANNEL } from 'src/modules/performer/constants';

const PERFORMER_STATUS_TOPIC = 'PERFORMER_STATUS_TOPIC';

interface UpdateStatus extends QueueEvent {
    data: {
        oldVerifiedDocument: string;
        verifiedDocument: string;
        email: string;
        name: string;
    };
}

@Injectable()
export class UpdatePerformerStatusListener {
    constructor(
        private readonly queueEventService: QueueEventService,
        @Inject(forwardRef(() => MailerService))
        private readonly mailService: MailerService
    ) {
        this.queueEventService.subscribe(
            PERFORMER_UPDATE_STATUS_CHANNEL,
            PERFORMER_STATUS_TOPIC,
            this.handleUpdateStatus.bind(this)
        );
    }

    public async handleUpdateStatus(event: UpdateStatus) {
        if (![EVENT.UPDATED].includes(event.eventName)) {
            return;
        }
        const { oldVerifiedDocument, verifiedDocument, email, name } =
            event.data;
        if (oldVerifiedDocument) {
            return;
        }
        if (email && verifiedDocument) {
            await this.mailService.send({
                subject: 'Account approval',
                to: email,
                data: { name, link: process.env.USER_URL },
                template: 'approved-performer-account'
            });
        }
    }
}
