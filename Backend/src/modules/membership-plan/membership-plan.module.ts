import { Global, Module } from '@nestjs/common';
import { MONGO_DB_PROVIDER, MongoDBModule } from 'src/kernel/infras/mongodb';
import { Connection } from 'mongoose';
import { MembershipPlanService } from './membership-plan.service';
import { MembershipPlanController } from './membership-plan.controller';
import {
    MembershipPlan,
    MembershipPlanSchema
} from './entities/membership-plan.entity';

@Module({
    controllers: [MembershipPlanController],
    providers: [
        MembershipPlanService,
        {
            provide: MembershipPlan.name,
            useFactory: (connection: Connection) =>
                connection.model(MembershipPlan.name, MembershipPlanSchema),
            inject: [MONGO_DB_PROVIDER]
        }
    ],
    exports: [MembershipPlanService],
    imports: [MongoDBModule]
})
@Global()
export class MembershipPlanModule {}
