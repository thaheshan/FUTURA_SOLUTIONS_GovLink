import {
    IsBoolean,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString
} from 'class-validator';
import { UserRole } from 'src/constant/userRole';

export class CreateUserV2Dto {
    @IsBoolean()
    @IsOptional()
    isVerified?: boolean;

    @IsString()
    @IsOptional()
    avatarUrl?: string;

    @IsString()
    @IsOptional()
    pageName?: string;

    @IsString()
    @IsOptional()
    pageUrl?: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    @IsBoolean()
    isActive: boolean;

    @IsMongoId()
    @IsNotEmpty()
    authUser: string;
}
