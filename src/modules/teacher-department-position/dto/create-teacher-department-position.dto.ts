import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  Validate,
  IsUUID,
} from 'class-validator';
import { format, formatISO } from 'date-fns';
import { IsValidDepartmentIdConstraint } from 'src/modules/departments/validators/is-valid-department-id.validator';
import { IsValidPositionIdConstraint } from 'src/modules/positions/validators';
import { IsValidUserIdConstraint } from 'src/modules/teachers/validators';

export class CreateTeacherDepartmentPositionDto {
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <userId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <userId> no debe estar vacía.' })
  @Validate(IsValidUserIdConstraint)
  userId: string;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <departmentId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <departmentId> no debe estar vacía.' })
  @Validate(IsValidDepartmentIdConstraint)
  departmentId: string;

  @IsString({
    message: 'La propiedad <positionId> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <positionId> no debe estar vacía.' })
  @Validate(IsValidPositionIdConstraint)
  positionId: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'La propiedad <startDate> debe ser una fecha válida, <yyyy-MM-dd>.',
    },
  )
  // @IsNotEmpty({ message: 'La propiedad <startDate> no debe estar vacía.' })
  // startDate: string | Date = format(
  //   new Date().toISOString(),
  //   "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  // );
  startDate: string = formatISO(new Date().toISOString());

  @IsDateString(
    {},
    {
      message:
        'La propiedad <endDate> debe ser una fecha válida, <yyyy-MM-dd>.',
    },
  )
  @IsOptional()
  endDate?: string;
}
