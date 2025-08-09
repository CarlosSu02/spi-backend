import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateTeacherCategoryDto {
  @ApiProperty({ description: 'Nombre de la categoría.', example: 'Titular', required: true })
  @IsString({
    message: 'La propiedad <name> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <name> no debe estar vacía.' })
  @Length(1, 100, {
    message: 'La propiedad <name> debe tener entre 1 y 100 caracteres.',
  })
  name: string;

  @ApiProperty({ description: 'Descripción de la categoría.', example: 'Docente con plaza titular', required: true })
  @IsString({
    message: 'La propiedad <description> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <description> no debe estar vacía.' })
  @Length(1, 100, {
    message: 'La propiedad <description> debe tener entre 1 y 100 caracteres.',
  })
  description: string;
}
