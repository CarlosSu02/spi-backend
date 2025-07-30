import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsInt,
  IsBoolean,
  IsUUID,
  Validate,
} from 'class-validator';
import { normalizeText } from 'src/common/utils';
import { Transform } from 'class-transformer';
import { IsValidDepartmentIdConstraint } from 'src/modules/departments/validators/is-valid-department-id.validator';
import { ExistsCodeCourseValidator } from '../validators';

export class CreateCourseDto {
  @IsString({
    message: 'La propiedad <name> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <name> no debe estar vacía.' })
  @Length(3, 100, {
    message: 'La propiedad <name> debe tener entre 3 y 100 caracteres.',
  })
  name: string;

  @IsString({
    message: 'La propiedad <code> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <code> no debe estar vacía.' })
  @Length(3, 7, {
    message: 'La propiedad <code> debe tener entre 3 y 7 caracteres.',
  })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message:
      'La propiedad <code> no puede contener guiones, puntos ni guiones bajos, solo letras y números.',
  })
  @Transform(({ value }) => typeof value === 'string' && normalizeText(value))
  @Validate(ExistsCodeCourseValidator)
  code: string;

  @IsInt({ message: 'La propiedad <uvs> debe ser un número entero.' })
  @IsNotEmpty({ message: 'La propiedad <uvs> no debe estar vacía.' })
  uvs: number;

  @IsBoolean({
    message: 'La propiedad <activeStatus> debe ser un valor booleano.',
  })
  @IsNotEmpty({ message: 'La propiedad <activeStatus> no debe estar vacía.' })
  activeStatus: boolean;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <departmentId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <departmentId> no debe estar vacía.' })
  @Validate(IsValidDepartmentIdConstraint)
  departmentId: string;
}
