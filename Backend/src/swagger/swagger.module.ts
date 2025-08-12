import { Module, Global, INestApplication } from '@nestjs/common';
import { SwaggerDocumentBuilder } from './swaggerDocumentBuilder';

@Global()
@Module({
    providers: [],
    exports: []
})
export class SwaggerModuleSetup {
    static setup(app: INestApplication) {
        new SwaggerDocumentBuilder(app).setupSwagger();
    }
}
