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
  IsValidCenterConfig,
  IsValidNameDepartmentConstraint,
} from '../validators';

export class CreateDepartmentDto {
  @IsString({
    message: 'La propiedad <name> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <name> no debe estar vacía.' })
  @Length(1, 100, {
    message: 'La propiedad <name> debe tener entre 1 y 100 caracteres.',
  })
  @Validate(IsValidNameDepartmentConstraint)
  name: string;

  @IsOptional()
  @IsInt({ message: 'La propiedad <centerId> debe ser un número.' })
  uvs: number | undefined;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <centerId> debe ser un UUID válido.',
  })
  @IsValidCenterConfig(ECenterConfig.CENTER)
  centerId: string;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <facultyId> debe ser un UUID válido.',
  })
  @IsValidCenterConfig(ECenterConfig.FACULTY)
  facultyId: string;
}
