import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Validate,
  ValidateIf,
} from 'class-validator';
import { EConfigType, EDegreeType } from '../enums';
import {
  IsValidConfigTeacherConstraint,
  IsValidGradDegreeConstraint,
  IsValidUserIdConstraint,
} from '../validators';
import { ValidatorConstraintDecorator } from 'src/common/decorators';

export class CreateTeacherDto {
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <undergradId> debe ser un UUID válido.',
  })
  // @IsValidGradDegree(EDegreeType.UNDERGRAD)
  @ValidatorConstraintDecorator(
    EDegreeType.UNDERGRAD,
    IsValidGradDegreeConstraint,
  )
  undergradId: string;

  @IsOptional()
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <undergradId> debe ser un UUID válido.',
  })
  // @IsValidGradDegree(EDegreeType.POSTGRAD)
  @ValidatorConstraintDecorator(
    EDegreeType.POSTGRAD,
    IsValidGradDegreeConstraint,
  )
  postgradId?: string;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <categoryId> debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'La propiedad <categoryId> no debe estar vacía.',
  })
  // @IsValidConfigTeacher(EConfigType.CATEGORY)
  @ValidatorConstraintDecorator(
    EConfigType.CATEGORY,
    IsValidConfigTeacherConstraint,
  )
  categoryId: string;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <contractTypeId> debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'La propiedad <contractTypeId> no debe estar vacía.',
  })
  // @IsValidConfigTeacher(EConfigType.CONTRACT)
  @ValidatorConstraintDecorator(
    EConfigType.CONTRACT,
    IsValidConfigTeacherConstraint,
  )
  contractTypeId: string;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <shiftId> debe ser un UUID válido versión.',
  })
  @IsNotEmpty({
    message: 'La propiedad <shiftId> no debe estar vacía.',
  })
  // @IsValidConfigTeacher(EConfigType.SHIFT)
  @ValidatorConstraintDecorator(
    EConfigType.SHIFT,
    IsValidConfigTeacherConstraint,
  )
  shiftId: string;

  @ValidateIf((o: CreateTeacherDto) => !o.currentUserId)
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <userId> debe ser un UUID válido.',
  })
  // @IsNotEmpty({
  //   message: 'La propiedad <userId> no debe estar vacía.',
  // })
  @Validate(IsValidUserIdConstraint)
  userId: string;

  @IsOptional()
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <currentUserId> debe ser un UUID válido.',
  })
  @Validate(IsValidUserIdConstraint)
  currentUserId?: string;
}
