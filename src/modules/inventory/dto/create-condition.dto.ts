import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateConditionDto {
  @IsString({
    message: 'La propiedad <status> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <status> no debe estar vacía.' })
  @Length(3, 50, {
    message: 'La propiedad <status> debe tener entre 3 y 50 caracteres.',
  })
  status: string;
}
