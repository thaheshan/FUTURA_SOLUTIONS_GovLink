import { Global, Module } from '@nestjs/common';
import { MONGO_DB_PROVIDER, MongoDBModule } from 'src/kernel';
import { Connection } from 'mongoose';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { Page, PageSchema } from './entities/page.entity';

@Module({
    controllers: [PageController],
    providers: [
        PageService,
        {
            provide: Page.name,
            useFactory: (connection: Connection) =>
                connection.model(Page.name, PageSchema),
            inject: [MONGO_DB_PROVIDER]
        }
    ],
    imports: [MongoDBModule],
    exports: [PageService]
})
@Global()
export class PageModule {}
