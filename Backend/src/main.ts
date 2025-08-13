/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
// global config for temmplates dir
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
process.env.TEMPLATE_DIR = `${__dirname}/../templates`;

import { NestFactory } from '@nestjs/core';
import {
    ValidationPipe,
    VersioningType,
    VERSION_NEUTRAL
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { Cluster } from './cluster';
import { AppModule } from './app.module';
import { renderFile } from './kernel/helpers/view.helper';
import { HttpExceptionLogFilter } from './kernel/logger/http-exception-log.filter';
import { RedisIoAdapter } from './modules/socket/redis-io.adapter';
import { SwaggerModuleSetup } from './swagger/swagger.module';
import { AllExceptionsFilter } from './core/common/filters/all-exceptions-filter';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const httpAdapter = app.getHttpAdapter();
    // TODO - config for domain
    app.enableCors({
        credentials: true,
        origin: ['http://localhost:8081', 'https://dev.inrcliq.com', 'https://admin.dev.inrcliq.com']
    });
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionLogFilter(httpAdapter));
    app.engine('html', renderFile);
    app.set('view engine', 'html');
    // socket io redis - for chat
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: [VERSION_NEUTRAL, '1'],
        prefix: 'v'
    });
    app.getHttpServer()
        ._events.request._router.stack.filter((r) => r.route)
        .forEach((r) => {
            console.log(
                `[Route] ${Object.keys(r.route.methods)
                    .join(',')
                    .toUpperCase()} ${r.route.path}`
            );
        });

    if (process.env.NODE_ENV === 'development') {
        // generate api docs
        SwaggerModuleSetup.setup(app);
    }

    await app.listen(process.env.HTTP_PORT);
}

if (process.env.CLUSTER_MODE) {
    Cluster.register(4, bootstrap);
} else {
    bootstrap();
}
