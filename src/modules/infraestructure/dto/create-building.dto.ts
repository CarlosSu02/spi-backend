import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsUUID,
} from 'class-validator';
import { ValidatorConstraintDecorator } from 'src/common/decorators';
import { ECenterConfig } from 'src/modules/departments/enums';
import { IsValidCenterConfigConstraint } from 'src/modules/departments/validators';

export class CreateBuildingDto {
  @IsString({
    message: 'La propiedad <name> debe ser una cadena de caracteres.',
  })
  @Length(3, 50, {
    message: 'La propiedad <name> debe ser entre 3 y 50 caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <name> no debe estar vacía.' })
  name: string;

  @IsString({
    message: 'La propiedad <color> debe ser una cadena de caracteres.',
  })
  @IsOptional()
  color?: string;

  @IsString({
    message: 'La propiedad <floors> debe ser una cadena de caracteres.',
  })
  @IsOptional()
  floors?: string;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <centerId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <centerId> no debe estar vacía.' })
  // FIXME: se debe arreglar esto
  // @IsValidCenterConfig(ECenterConfig.CENTER)
  @ValidatorConstraintDecorator(
    ECenterConfig.CENTER,
    IsValidCenterConfigConstraint,
  )
  centerId: string;
}
