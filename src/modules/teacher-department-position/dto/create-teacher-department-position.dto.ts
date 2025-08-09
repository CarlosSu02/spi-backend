import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'uuid-user', required: true, description: 'ID del usuario docente.' })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <userId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <userId> no debe estar vacía.' })
  @Validate(IsValidUserIdConstraint)
  userId: string;

  @ApiProperty({ example: 'uuid-department', required: true, description: 'ID del departamento.' })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <departmentId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <departmentId> no debe estar vacía.' })
  @Validate(IsValidDepartmentIdConstraint)
  departmentId: string;

  @ApiProperty({ example: 'uuid-position', required: true, description: 'ID del cargo.' })
  @IsString({
    message: 'La propiedad <positionId> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <positionId> no debe estar vacía.' })
  @Validate(IsValidPositionIdConstraint)
  positionId: string;

  @ApiProperty({ example: '2025-08-09', required: false, description: 'Fecha de inicio.' })
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'La propiedad <startDate> debe ser una fecha válida, <yyyy-MM-dd>.',
    },
  )
  startDate: string = formatISO(new Date().toISOString());

  @ApiProperty({ example: '2025-12-31', required: false, description: 'Fecha de fin.' })
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
