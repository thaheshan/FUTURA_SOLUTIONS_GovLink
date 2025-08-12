// login.dto.ts

import { IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    identifier: string;

    @IsString()
    @MinLength(6)
    password: string;
}
