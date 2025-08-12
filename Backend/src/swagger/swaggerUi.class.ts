import { SwaggerCustomOptions } from '@nestjs/swagger';

export class SwaggerUI {
    static getOptions(): SwaggerCustomOptions {
        return {
            customCss: '.swagger-ui { background-color: rgb(255, 255, 255); }',
            customSiteTitle: 'Insider-HUB API Documentation',
            explorer: true
        };
    }
}
