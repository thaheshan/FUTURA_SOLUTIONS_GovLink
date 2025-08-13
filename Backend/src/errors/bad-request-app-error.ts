import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestAppError extends HttpException {
    constructor(message: string, code?: string) {
        super({ message, code }, HttpStatus.BAD_REQUEST);
    }
}
