import { Injectable } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { SPECIAL_REQUEST_CHANNEL } from '../constants';

interface SpecialRequestLData extends QueueEvent {
    data: {
        id: string;
        status: string;
    };
}

@Injectable()
export class SpecialRequestListener {
    constructor(private readonly queueEventService: QueueEventService) {
        this.queueEventService.subscribe(
            SPECIAL_REQUEST_CHANNEL,
            'SPECIAL_REQUEST_TOPIC',
            this.handleRequestUpdate.bind(this)
        );
    }

    /**
     * Handle status update for a special request
     * @param event - Event data from the QueueEventService
     */
    async handleRequestUpdate(event: SpecialRequestLData): Promise<void> {
        const { eventName, data } = event;

        if (eventName !== EVENT.UPDATED) return;
        const { id, status } = data;
        console.log(`Special request ${id} updated to ${status}.`);

        // Placeholder: Add notification logic
    }
}
