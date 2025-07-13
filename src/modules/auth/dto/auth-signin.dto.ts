import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthSigninDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
