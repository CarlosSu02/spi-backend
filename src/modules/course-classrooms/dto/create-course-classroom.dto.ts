import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsUUID,
  Length,
  IsOptional,
} from 'class-validator';
import { ValidatorConstraintDecorator } from 'src/common/decorators';
import { EInventoryConfig } from 'src/modules/inventory/enums';
import { IsValidIdsInventoryConfigConstraint } from 'src/modules/inventory/validators';
import { ETeachingAssignmentConfig } from 'src/modules/teaching-assignment/enums';
import { IsValidIdsTeachingAssignmentConfigConstraint } from 'src/modules/teaching-assignment/validators';
import { ECourseClassroomConfig } from '../enums';
import { IsValidClassroomConfigConstraint } from '../validators';

export class CreateCourseClassroomDto {
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <courseId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <courseId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    ECourseClassroomConfig.COURSE,
    IsValidClassroomConfigConstraint,
  )
  courseId: string;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <classroomId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <classroomId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    EInventoryConfig.CLASSROOM,
    IsValidIdsInventoryConfigConstraint,
  )
  classroomId: string;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <teachingSessionId> debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'La propiedad <teachingSessionId> no debe estar vacía.',
  })
  @ValidatorConstraintDecorator(
    ETeachingAssignmentConfig.SESSION,
    IsValidIdsTeachingAssignmentConfigConstraint,
  )
  teachingSessionId: string;

  @IsString({
    message: 'La propiedad <section> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <section> no debe estar vacía.' })
  @Length(3, 50, {
    message: 'La propiedad <section> debe tener entre 3 y 50 caracteres.',
  })
  section: string;

  @IsString({
    message:
      'La propiedad <days> debe ser una cadena de caracteres, por ejemplo: 3 o LuMaMi, 4 o LuMaMiJu.',
  })
  @IsNotEmpty({ message: 'La propiedad <days> no debe estar vacía.' })
  @Length(1, 20, {
    message: 'La propiedad <days> debe tener entre 1 y 20 caracteres.',
  })
  days: string;

  @IsInt({ message: 'La propiedad <studentCount> debe ser un número entero.' })
  @IsNotEmpty({ message: 'La propiedad <studentCount> no debe estar vacía.' })
  studentCount: number;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <modalityId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <modalityId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    ECourseClassroomConfig.MODALITY,
    IsValidClassroomConfigConstraint,
  )
  modalityId: string;

  @IsBoolean({
    message: 'La propiedad <nearGraduation> debe ser un valor booleano.',
  })
  @IsNotEmpty({ message: 'La propiedad <nearGraduation> no debe estar vacía.' })
  nearGraduation: boolean = false;

  @IsString({
    message:
      'La propiedad <groupCode> debe ser una cadena de caracteres, por ejemplo: G1, G2, etc.',
  })
  @IsNotEmpty({ message: 'La propiedad <groupCode> no debe estar vacía.' })
  @Length(2, 10, {
    message: 'La propiedad <groupCode> debe tener entre 2 y 10 caracteres.',
  })
  groupCode: string = 'G1'; // ya esta for defecto en la base de datos

  @IsString({
    message: 'La propiedad <observation> debe ser una cadena de caracteres.',
  })
  @IsOptional()
  @Length(0, 500, {
    message: 'La propiedad <observation> debe tener hasta 500 caracteres.',
  })
  observation?: string;
}
