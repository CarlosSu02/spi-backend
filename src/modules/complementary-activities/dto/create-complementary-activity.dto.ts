import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  Length,
  ValidateIf,
  IsEnum,
} from 'class-validator';
import { ValidatorConstraintDecorator } from 'src/common/decorators';
import { ETeachingAssignmentConfig } from 'src/modules/teaching-assignment/enums';
import { IsValidIdsTeachingAssignmentConfigConstraint } from 'src/modules/teaching-assignment/validators';
import { EActivityType, EPogressLevel } from '../enums';

export class CreateComplementaryActivityDto {
  @ApiProperty({
    description: 'Nombre de la actividad.',
  })
  @IsString({
    message: 'La propiedad <name> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <name> no debe estar vacía.' })
  @Length(3, 100, {
    message: 'La propiedad <name> debe tener entre 3 y 100 caracteres.',
  })
  name: string;

  @ApiProperty({
    description: '¿La actividad está registrada? Es opcional.',
  })
  @IsBoolean({
    message: 'La propiedad <isRegistered> debe se un valor booleano.',
  })
  @IsOptional()
  isRegistered?: boolean;

  @ApiProperty({
    description:
      'Número de expediente. Es opciona, pero obligatorio si se marca que está registrada la actividad.',
  })
  @ValidateIf((ca: CreateComplementaryActivityDto) => !!ca.isRegistered)
  @IsString({
    message: 'La propiedad <fileNumber> debe ser una cadena de caracteres.',
  })
  // @IsOptional()
  @IsNotEmpty({
    message:
      'Si marco que la actividad está registrada debe ingresas el número de expediente.',
  })
  fileNumber: string;

  @ApiProperty({
    name: 'progressLevel',
    enum: EPogressLevel,
    description: 'Nivel de avance de la actividad.',
    example: EPogressLevel.PROPOSAL,
  })
  @IsString({
    message: 'La propiedad <progressLevel> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <progressLevel> no debe estar vacía.' })
  @IsEnum(EPogressLevel, {
    message: `El nivel de avance debe ser uno de los siguientes: ${Object.values(EPogressLevel).join(', ')}.`,
  })
  progressLevel: EPogressLevel;

  @ApiProperty({
    description: 'ID de la asignación académica a la que pertenece.',
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <assignmentReportId> debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'La propiedad <assignmentReportId> no debe estar vacía.',
  })
  @ValidatorConstraintDecorator(
    ETeachingAssignmentConfig.ASSIGNMENT,
    IsValidIdsTeachingAssignmentConfigConstraint,
  )
  assignmentReportId: string;

  // @ApiProperty({
  //   description: 'ID del tipo de actividad.',
  // })
  // @IsUUID('all', {
  //   each: true,
  //   message: 'La propiedad <activityTypeId> debe ser un UUID válido.',
  // })
  // @IsNotEmpty({ message: 'La propiedad <activityTypeId> no debe estar vacía.' })
  // @ValidatorConstraintDecorator(
  //   EComplementaryActivityConfig.ACTIVITY_TYPE,
  //   IsValidComplementaryActivityConfigConstraint,
  // )
  // activityTypeId: string;

  @ApiProperty({
    name: 'activityType',
    enum: EActivityType,
    description: 'Tipo de actividad.',
    example: EActivityType.Research,
  })
  @IsString({
    message: 'La propiead <activityType> debe se una cadena de caracteres.',
  })
  @IsEnum(EActivityType, {
    message: `El tipo de actividad debe ser uno de los siguientes: ${Object.values(EActivityType).join(', ')}.`,
  })
  activityType: EActivityType;
}
