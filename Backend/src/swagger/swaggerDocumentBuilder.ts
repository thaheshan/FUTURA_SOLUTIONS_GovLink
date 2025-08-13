import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SWAGGER_TAGS } from 'src/core/common/constants/swagger.constants';
import { SwaggerUI } from './swaggerUi.class';

export class SwaggerDocumentBuilder {
    constructor(private readonly app: INestApplication) {}

    public setupSwagger(): void {
        const config = new DocumentBuilder()
            .setTitle('Insider-HUB API')
            .setDescription('API documentation for Insider-HUB')
            .setVersion('1.0')
            .addTag(SWAGGER_TAGS.AUTH)
            .addTag(SWAGGER_TAGS.USERS)
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(this.app, config, {
            deepScanRoutes: true,
            ignoreGlobalPrefix: false
        });
        SwaggerModule.setup(
            'apiDocs',
            this.app,
            document,
            SwaggerUI.getOptions()
        );
    }
}
