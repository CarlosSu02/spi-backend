import { IsUUID, Validate } from 'class-validator';
import { EDegreeType } from 'src/modules/teachers/enums';
import {
  IsValidGradDegree,
  IsValidUserIdConstraint,
} from 'src/modules/teachers/validators';

export class CreateTeacherUndergradDto {
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
    message: 'La propiedad <undergradId> debe ser un UUID válido.',
  })
  @IsValidGradDegree(EDegreeType.UNDERGRAD)
  undergradId: string;
}
