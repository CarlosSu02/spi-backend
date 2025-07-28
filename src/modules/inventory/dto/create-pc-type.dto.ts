import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePcTypeDto {
  @IsString({
    message: 'La propiedad <description> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <description> no debe estar vacía.' })
  @Length(3, 100, {
    message: 'La propiedad <description> debe tener entre 3 y 100 caracteres.',
  })
  description: string;
}
