import { Injectable } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { SPECIAL_REQUEST_PAYMENT_CHANNEL } from '../constants';

interface PaymentData extends QueueEvent {
    data: {
        id: string;
        paymentStatus: string;
        creatorID: string;
        fanID: string;
    };
}

@Injectable()
export class SpecialRequestPaymentListener {
    constructor(private readonly queueEventService: QueueEventService) {
        this.queueEventService.subscribe(
            SPECIAL_REQUEST_PAYMENT_CHANNEL,
            'SPECIAL_REQUEST_PAYMENT_TOPIC',
            this.handlePaymentEvent.bind(this)
        );
    }

    /**
     * Handle payment events
     * @param event - Queue event data
     */
    async handlePaymentEvent(event: PaymentData): Promise<void> {
        const { eventName, data } = event;

        if (eventName !== EVENT.UPDATED) return;

        const { id, paymentStatus, creatorID, fanID } = data;
        console.log(
            `Payment updated for request: ${id}, status: ${paymentStatus}`
        );

        if (paymentStatus === 'PAID') {
            // Notify performer and requester
            console.log(`Notifying creator ${creatorID} and fan ${fanID}`);
            // TODO: Add actual notification logic
        }
    }
}
