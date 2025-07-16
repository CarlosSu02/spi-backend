import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString({
    message: 'La propiedad <name> debe ser una cadena de caracteres.',
  })
  @Length(3, 50, {
    message: 'La propiedad <name> debe ser entre 3 y 50 caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <name> no se debe estar vacía.' })
  name: string;

  @IsString({
    message: 'La propiedad <description> debe ser una cadena de caracteres.',
  })
  @Length(3, 50, {
    message: 'La propiedad <description> debe ser entre 3 y 50 caracteres.',
  })
  @IsOptional()
  description: string | null;
}
