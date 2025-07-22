import { IsString, Length, IsNotEmpty, Validate } from 'class-validator';
import { IsValidNamePositionConstraint } from '../validators';

export class CreatePositionDto {
  @IsString({
    message: 'La propiedad <name> debe ser una cadena de caracteres.',
  })
  @Length(3, 50, {
    message: 'La propiedad <name> debe ser entre 3 y 50 caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <name> no se debe estar vacía.' })
  @Validate(IsValidNamePositionConstraint)
  name: string;
}
