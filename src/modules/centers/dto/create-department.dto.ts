import {
  IsString,
  IsNotEmpty,
  Length,
  IsUUID,
  IsOptional,
  IsInt,
  Validate,
} from 'class-validator';
import { ECenterConfig } from '../enums';
import {
  IsValidCenterConfigConstraint,
  IsValidNameDepartmentConstraint,
} from '../validators';
import { ValidatorConstraintDecorator } from 'src/common/decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Nombre del departamento.',
    example: 'Departamento de Ingeniería',
    required: true,
  })
  @IsString({
    message: 'La propiedad <name> debe ser una cadena de texto.',
  })
  @IsNotEmpty({ message: 'La propiedad <name> no debe estar vacía.' })
  @Length(1, 100, {
    message: 'La propiedad <name> debe tener entre 1 y 100 caracteres.',
  })
  @Validate(IsValidNameDepartmentConstraint)
  name: string;

  @ApiPropertyOptional({
    description: 'Número de UVs.',
    example: 30,
  })
  @IsOptional()
  @IsInt({ message: 'La propiedad <uvs> debe ser un número.' })
  uvs: number | undefined;

  @ApiProperty({
    description: 'ID del centro al que pertenece el departamento.',
    example: '65039ef6-1fc5-474c-b4e3-27239c200138',
    required: true,
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <centerId> debe ser un UUID válido.',
  })
  // @IsValidCenterConfig(ECenterConfig.CENTER)
  @ValidatorConstraintDecorator(
    ECenterConfig.CENTER,
    IsValidCenterConfigConstraint,
  )
  centerId: string;

  @ApiProperty({
    description: 'ID de la facultad a la que pertenece el departamento.',
    example: '65039ef6-1fc5-474c-b4e3-27239c200138',
    required: true,
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <facultyId> debe ser un UUID válido.',
  })
  // @IsValidCenterConfig(ECenterConfig.FACULTY)
  @ValidatorConstraintDecorator(
    ECenterConfig.FACULTY,
    IsValidCenterConfigConstraint,
  )
  facultyId: string;
}
