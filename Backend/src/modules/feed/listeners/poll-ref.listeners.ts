import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { Model } from 'mongoose';
import { EVENT } from 'src/kernel/constants';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { MailerService } from 'src/modules/mailer';
import {
    PERFORMER_FEED_CHANNEL,
    POLL_TARGET_SOURCE,
    VOTE_FEED_CHANNEL
} from '../constants';
import { POLL_PROVIDER } from '../providers';
import { PollModel, VoteModel } from '../models';
import { FeedService } from '../services';

const POLL_FEED_TOPIC = 'POLL_FEED_TOPIC';
const VOTE_POLL_TOPIC = 'VOTE_POLL_TOPIC';

interface PollFeed extends QueueEvent {
    data: {
        pollIds: string;
        _id: string;
    };
}

@Injectable()
export class PollFeedListener {
    constructor(
        @Inject(forwardRef(() => FeedService))
        private readonly feedService: FeedService,
        @Inject(forwardRef(() => PerformerService))
        private readonly performerService: PerformerService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly queueEventService: QueueEventService,
        private readonly mailerService: MailerService,
        @Inject(POLL_PROVIDER)
        private readonly pollModel: Model<PollModel>
    ) {
        this.queueEventService.subscribe(
            PERFORMER_FEED_CHANNEL,
            POLL_FEED_TOPIC,
            this.handleRefPoll.bind(this)
        );
        this.queueEventService.subscribe(
            VOTE_FEED_CHANNEL,
            VOTE_POLL_TOPIC,
            this.handleVotePoll.bind(this)
        );
    }

    public async handleRefPoll(event: PollFeed) {
        if (![EVENT.CREATED].includes(event.eventName)) {
            return;
        }
        const { pollIds, _id: feedId } = event.data;
        if (!pollIds || !pollIds.length) return;
        if (event.eventName === EVENT.CREATED) {
            await this.pollModel.updateMany(
                { _id: { $in: pollIds } },
                { refId: feedId, fromRef: POLL_TARGET_SOURCE.FEED }
            );
        }
    }

    public async handleVotePoll(event: QueueEvent) {
        if (![EVENT.CREATED, EVENT.DELETED].includes(event.eventName)) {
            return;
        }
        const { targetId, refId, fromSourceId } = event.data as VoteModel;

        if (event.eventName === EVENT.CREATED) {
            await this.pollModel.updateOne(
                { _id: targetId },
                { $inc: { totalVote: 1 } }
            );
            const [feed, user] = await Promise.all([
                this.feedService.findById(refId),
                this.userService.findById(fromSourceId)
            ]);
            const performer =
                feed &&
                (await this.performerService.findById(feed.fromSourceId));
            performer?.email &&
                (await this.mailerService.send({
                    subject: 'Voted a poll',
                    to: performer?.email,
                    data: {
                        link: `${process.env.USER_URL}/post/${
                            feed.slug || feed._id
                        }`,
                        userName: user?.name || user?.username
                    },
                    template: 'performer-voted-poll'
                }));
        }
    }
}
