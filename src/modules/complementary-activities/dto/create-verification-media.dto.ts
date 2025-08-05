import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNotEmpty,
  IsUrl,
  IsEnum,
  ValidateIf,
  IsString,
  Length,
} from 'class-validator';
import { EComplementaryActivityConfig, EMultimediaType } from '../enums';
import { ValidatorConstraintDecorator } from 'src/common/decorators';
import { IsValidComplementaryActivityConfigConstraint } from '../validators';

// TODO: validator constraints
// TODO: 2 ver lo de los archivos
export class CreateVerificationMediaDto {
  // @IsUUID('all', {
  //   each: true,
  //   message: 'La propiedad <multimediaTypeId> debe ser un UUID válido.',
  // })
  // @IsNotEmpty({
  //   message: 'La propiedad <multimediaTypeId> no debe estar vacía.',
  // })
  // multimediaTypeId: string;

  @ApiProperty({
    description: 'Descripción del medio de verificación.',
    example: 'Foto de la actividad...',
  })
  @IsString({
    message: 'La propiedad <description> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({
    message: 'La propiedad <descriptionType> no debe estar vacía.',
  })
  @Length(3, 250, {
    message: 'La propiedad <description> debe tener entre 3 y 250 caracteres.',
  })
  description: string;

  @ApiProperty({
    description: 'Tipo de multimedia.',
    example: 'PDF',
  })
  @IsEnum(EMultimediaType, {
    message: `Tipo de multimedia no permitido, los permitidos son: ${Object.values(EMultimediaType).join(', ')}.`,
  })
  @IsNotEmpty({
    message: 'La propiedad <multimediaType> no debe estar vacía.',
  })
  multimediaType: string;

  // Para guardar la referencia o acceso de cloudinary
  @ValidateIf(
    (vm: CreateVerificationMediaDto) =>
      vm.multimediaType !== (EMultimediaType.PlaneText as string),
  )
  @IsUrl(
    {},
    {
      message: 'La propiedad <url> debe ser una url.',
    },
  )
  @IsNotEmpty({
    message: 'La propiedad <url> no debe estar vacía.',
  })
  url: string;

  @ApiProperty({
    description:
      'ID de la actividad complementaria a la que se le asginará este medio de verificación.',
    example: 'uuid',
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <activityId> debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'La propiedad <activityId> no debe estar vacía.',
  })
  @ValidatorConstraintDecorator(
    EComplementaryActivityConfig.COMPLEMENTARY,
    IsValidComplementaryActivityConfigConstraint,
  )
  activityId: string;
}
