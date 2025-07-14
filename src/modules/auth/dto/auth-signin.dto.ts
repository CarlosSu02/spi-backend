import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthSigninDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
