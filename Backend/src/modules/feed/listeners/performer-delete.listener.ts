import { Injectable, Inject } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { EVENT, STATUS } from 'src/kernel/constants';
import { DELETE_PERFORMER_CHANNEL } from 'src/modules/performer/constants';
import { PerformerDto } from 'src/modules/performer/dtos';
import { FeedModel } from '../models';
import { FEED_PROVIDER } from '../providers';
import { PERFORMER_FEED_CHANNEL } from '../constants';

const DELETE_PERFORMER_FEED_TOPIC = 'DELETE_PERFORMER_FEED_TOPIC';

@Injectable()
export class DeletePerformerFeedListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(FEED_PROVIDER)
    private readonly feedModel: Model<FeedModel>
  ) {
    this.queueEventService.subscribe(
      DELETE_PERFORMER_CHANNEL,
      DELETE_PERFORMER_FEED_TOPIC,
      this.handleDeleteData.bind(this)
    );
  }

  private async handleDeleteData(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.DELETED) return;
    const user = event.data as PerformerDto;
    const count = await this.feedModel.countDocuments({
      fromSourceId: user._id,
      status: STATUS.ACTIVE
    });
    count && await this.feedModel.updateMany({
      fromSourceId: user._id
    }, { status: STATUS.INACTIVE });
    count && await this.queueEventService.publish(
      new QueueEvent({
        channel: PERFORMER_FEED_CHANNEL,
        eventName: EVENT.DELETED,
        data: { fromSourceId: user._id, count: -count }
      })
    );
  }
}
