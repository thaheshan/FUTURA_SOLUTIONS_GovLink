import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  text = 'Hello World!';

  getHello(): string {
    return this.text;
  }
}
