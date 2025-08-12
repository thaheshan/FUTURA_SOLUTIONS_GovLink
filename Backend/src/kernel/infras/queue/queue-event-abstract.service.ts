import { QueueEvent } from 'src/kernel/events';

export abstract class QueueEventServiceAbstract {
  abstract subscribe(
    topic: string,
    eventName: string,
    handler: (data: any) => Promise<void>
  ): Promise<void>;

  abstract publish(event: QueueEvent): Promise<void>;
}
