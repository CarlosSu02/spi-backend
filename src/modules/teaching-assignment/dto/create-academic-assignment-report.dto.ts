import { IsUUID, IsNotEmpty, Validate, IsString } from 'class-validator';
import { ValidatorConstraintDecorator } from 'src/common/decorators';
import { IsValidDepartmentIdConstraint } from 'src/modules/departments/validators/is-valid-department-id.validator';
import { IsValidUserIdConstraint } from 'src/modules/teachers/validators';
import { ETeachingAssignmentConfig } from '../enums';
import { IsValidIdsTeachingAssignmentConfigConstraint } from '../validators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAcademicAssignmentReportDto {
  // con el userId tenemos todo
  // @ApiProperty({})
  // @IsUUID('all', {
  //   each: true,
  //   message: 'La propiedad <teacherId> debe ser un UUID válido.',
  // })
  // @IsString({
  //   message: 'La propiedad <teacherCode> no debe ser una cadena de caracteres.',
  // })
  // // @IsNotEmpty({ message: 'La propiedad <teacherId> no debe estar vacía.' })
  // @IsNotEmpty({ message: 'La propiedad <teacherCode> no debe estar vacía.' })
  // teacherCode: string;

  @ApiProperty({
    example: '65039ef6-1fc5-474c-b4e3-27239c200138',
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <userId> debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'La propiedad <userId> no debe estar vacía.',
  })
  @Validate(IsValidUserIdConstraint)
  userId: string;

  @ApiProperty({
    example: '65039ef6-1fc5-474c-b4e3-27239c200138',
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <departmentId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <departmentId> no debe estar vacía.' })
  @Validate(IsValidDepartmentIdConstraint)
  departmentId: string;

  @ApiProperty({
    example: '65039ef6-1fc5-474c-b4e3-27239c200138',
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <periodId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <periodId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    ETeachingAssignmentConfig.PERIOD,
    IsValidIdsTeachingAssignmentConfigConstraint,
  )
  periodId: string;
}
