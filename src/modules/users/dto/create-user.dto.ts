import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
  ValidateIf,
} from 'class-validator';
import { EUserRole } from '../../../common/enums';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from 'src/modules/teachers/dto/create-teacher.dto';
import { TeacherRequiredFieldsForRoleConstraint } from '../validators/teacher-required-fields.validator';

export class CreateUserDto extends PartialType(CreateTeacherDto) {
  @ApiProperty({ description: 'Nombre del usuario.', example: 'Juan Pérez', required: true })
  @IsString({
    message: 'La propiedad <name> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <name> no se debe estar vacía.' })
  name: string;

  @ApiProperty({ description: 'Correo electrónico del usuario.', example: 'juan.perez@email.com', required: true })
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

  @ApiProperty({ description: 'Código del usuario.', example: 'USR123', required: true })
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

  // Para no agregar en vada propiedad el ValidateIf
  @ValidateIf((o: CreateUserDto) =>
    [EUserRole.DOCENTE, EUserRole.COORDINADOR_AREA].includes(o.role),
  )
  @Validate(TeacherRequiredFieldsForRoleConstraint)
  dummyFieldForTeacher: string;
}
