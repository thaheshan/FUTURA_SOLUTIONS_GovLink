import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppError } from '../../../errors/app-error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        let status: number;
        let message: string;
        let code: string | undefined;

        if (exception instanceof HttpException) {
            const errResp = exception.getResponse();
            status = exception.getStatus();
            if (typeof errResp === 'string') {
                message = errResp;
            } else if (typeof errResp === 'object' && errResp !== null) {
                const obj = errResp as Record<string, unknown>;
                const msg = obj.message;
                const cd = obj.code;

                if (typeof msg === 'string' || Array.isArray(msg)) {
                    message = Array.isArray(msg) ? msg.join('; ') : msg;
                } else {
                    message = JSON.stringify(obj);
                }

                if (typeof cd === 'string') {
                    code = cd;
                }
            } else {
                message = 'Unexpected error response';
            }
        } else if (exception instanceof AppError) {
            status = exception.statusCode;
            message = exception.message;
            code = exception.code;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
        }

        res.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: req.url,
            message,
            code
        });
    }
}
