import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Queue = require('bee-queue');

@Injectable()
export class QueueService {
  constructor(private readonly config?: any) {
  }

  public createInstance(name: string, config?: any) {
    return new Queue(name, config || this.config);
  }
}
