import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { EUserRole } from '../../../common/enums';

export class CreateUserDto {
  @IsString({
    message: 'La propiedad <name> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <name> no se debe estar vacía.' })
  name: string;

  @IsEmail(
    {},
    {
      message:
        'La propiedad <email> debe tener formato de correo, ejemplo: example@gmail.com',
    },
  )
  @IsString({
    message: 'La propiedad <email> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <email> no se debe estar vacía.' })
  email: string;

  @IsString({
    message: 'La propiedad <code> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <code> no se debe estar vacía.' })
  code: string;

  @IsString({
    message: 'La propiedad <password> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <password> no se debe estar vacía.' })
  @Length(5, 50, {
    message: 'La propiedad <password> debe ser entre 3 y 50 caracteres.',
  })
  password: string;

  @IsString({
    message:
      'La propiedad <passwordConfirm> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({
    message: 'La propiedad <passwordConfirm> no se debe estar vacía.',
  })
  @Length(5, 50, {
    message: 'La propiedad <passwordConfirm> debe ser entre 3 y 50 caracteres.',
  })
  passwordConfirm: string;

  @IsEnum(EUserRole, {
    message: `El rol debe ser uno de los siguientes: ${Object.values(EUserRole).join(', ')}`,
  })
  role: EUserRole;
}
