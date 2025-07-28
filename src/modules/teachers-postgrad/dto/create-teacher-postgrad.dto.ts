import { IsUUID, Validate } from 'class-validator';
import { ValidatorConstraintDecorator } from 'src/common/decorators';
import { EDegreeType } from 'src/modules/teachers/enums';
import {
  IsValidGradDegreeConstraint,
  IsValidUserIdConstraint,
} from 'src/modules/teachers/validators';

export class CreateTeacherPostgradDto {
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <userId> debe ser un UUID válido.',
  })
  // @IsNotEmpty({
  //   message: 'La propiedad <userId> no debe estar vacía.',
  // })
  @Validate(IsValidUserIdConstraint)
  userId: string;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <postgradId> debe ser un UUID válido.',
  })
  // @IsValidGradDegree(EDegreeType.POSTGRAD)
  @ValidatorConstraintDecorator(
    EDegreeType.POSTGRAD,
    IsValidGradDegreeConstraint,
  )
  postgradId: string;
}
