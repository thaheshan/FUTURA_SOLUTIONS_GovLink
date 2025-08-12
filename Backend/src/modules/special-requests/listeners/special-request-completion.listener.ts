import { Injectable } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { SPECIAL_REQUEST_CHANNEL } from '../constants';

interface SpecialRequestData extends QueueEvent {
    data: {
        id: string;
        creatorID: string;
        fanID: string;
        status: string;
    };
}

@Injectable()
export class SpecialRequestCompletionListener {
    constructor(private readonly queueEventService: QueueEventService) {
        this.queueEventService.subscribe(
            SPECIAL_REQUEST_CHANNEL,
            'SPECIAL_REQUEST_COMPLETION_TOPIC',
            this.handleCompletionEvent.bind(this)
        );
    }

    async handleCompletionEvent(event: SpecialRequestData) {
        const { eventName, data } = event;
        if (eventName !== EVENT.UPDATED || data.status !== 'completed') {
            return;
        }
        const { id, fanID, creatorID } = data;

        // Placeholder for notification or post-completion actions
        console.log(
            `Request ${id} completed by creator ${creatorID}. Notify fan ${fanID}`
        );

        // TODO: Add notification logic
    }
}
