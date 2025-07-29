import { IsDateString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';
import { ValidatorConstraintDecorator } from 'src/common/decorators';
import { ETeachingAssignmentConfig } from '../enums';
import { IsValidIdsTeachingAssignmentConfigConstraint } from '../validators';

export class CreateTeachingSessionDto {
  @IsDateString(
    {},
    { message: 'La propiedad <consultHour> debe ser una fecha válida.' },
  )
  @IsOptional()
  consultHour?: string;

  @IsDateString(
    {},
    { message: 'La propiedad <tutoringHour> debe ser una fecha válida.' },
  )
  @IsOptional()
  tutoringHour?: string;

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
}
