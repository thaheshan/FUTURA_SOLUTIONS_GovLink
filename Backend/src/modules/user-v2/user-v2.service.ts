import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserV2 } from './schema/user-v2.schema';
import { USER_V2_MODEL } from './userV2Provider';

@Injectable()
export class UserV2Service {
    constructor(@Inject(USER_V2_MODEL) private userModel: Model<UserV2>) {}

    async create(data: Partial<UserV2>): Promise<UserV2> {
        return this.userModel.create(data);
    }

    async findByEmailOrUsername(identifier: string): Promise<UserV2 | null> {
        return this.userModel
            .findOne({
                $or: [{ email: identifier }, { username: identifier }]
            })
            .populate('authUser');
    }

    async findByAuthUserId(authUserId: string): Promise<UserV2 | null> {
        return (
            await this.userModel.findOne({ authUser: authUserId })
        ).populate('authUser');
    }

    async update(id: string, data: Partial<UserV2>): Promise<UserV2> {
        return this.userModel.findByIdAndUpdate(id, data, { new: true });
    }

    async updateByAuthUserId(
        authUserId: string,
        data: Partial<UserV2>
    ): Promise<UserV2> {
        return this.userModel.findOneAndUpdate({ authUser: authUserId }, data, {
            new: true
        });
    }

    async findAll(): Promise<UserV2[]> {
        return this.userModel.find();
    }

    async findById(id: string): Promise<UserV2 | null> {
        return this.userModel.findById(id).populate('authUser');
    }

    async deleteById(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id);
    }
}
