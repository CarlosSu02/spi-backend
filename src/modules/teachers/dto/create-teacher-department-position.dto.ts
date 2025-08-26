import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  Validate,
  IsUUID,
} from 'class-validator';
import { formatISO } from 'date-fns';
import { IsValidDepartmentIdConstraint } from 'src/modules/departments/validators/is-valid-department-id.validator';
import { IsValidPositionIdConstraint } from 'src/modules/teachers-config/validators';
import { IsValidUserIdConstraint } from 'src/modules/teachers/validators';

export class CreateTeacherDepartmentPositionDto {
  @ApiProperty({
    example: 'eec45228-d3ed-4f0a-bd56-d44a7d2818e8',
    required: true,
    description: 'ID del usuario docente.',
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <userId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <userId> no debe estar vacía.' })
  @Validate(IsValidUserIdConstraint)
  userId: string;

  @ApiProperty({
    example: '484b0088-09ac-467b-981a-a0885deb69cb',
    required: true,
    description: 'ID del departamento.',
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <departmentId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <departmentId> no debe estar vacía.' })
  @Validate(IsValidDepartmentIdConstraint)
  departmentId: string;

  @ApiProperty({
    example: 'uuid-position',
    required: true,
    description: 'ID del cargo.',
  })
  @IsString({
    message: 'La propiedad <positionId> debe ser una cadena de texto.',
  })
  @IsNotEmpty({ message: 'La propiedad <positionId> no debe estar vacía.' })
  @Validate(IsValidPositionIdConstraint)
  positionId: string;

  @ApiProperty({
    example: '2025-08-09',
    required: false,
    description: 'Fecha de inicio.',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'La propiedad <startDate> debe ser una fecha válida, <yyyy-MM-dd>.',
    },
  )
  startDate: string = formatISO(new Date().toISOString());

  @ApiProperty({
    example: '2025-12-31',
    required: false,
    description: 'Fecha de fin.',
  })
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
