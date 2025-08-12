import { IsEmail, IsIn } from 'class-validator';
import { UserRole } from 'src/constant/userRole';

export class AssignRoleDto {
    @IsEmail()
    email: string;

    @IsIn([UserRole.Creator, UserRole.Fan])
    role: UserRole.Creator | UserRole.Fan;
}
