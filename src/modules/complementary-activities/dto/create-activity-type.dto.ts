import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityTypeDto {
  @ApiProperty({
    description: 'Nombre del tipo de actividad.',
  })
  @IsString({
    message: 'La propiedad <name> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <name> no debe estar vacía.' })
  @Length(3, 100, {
    message: 'La propiedad <name> debe tener entre 3 y 100 caracteres.',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del tipo de actividad, es opcional.',
  })
  @IsString({
    message: 'La propiedad <description> debe ser una cadena de caracteres.',
  })
  @Length(3, 250, {
    message: 'La propiedad <description> debe tener entre 3 y 250 caracteres.',
  })
  @IsOptional()
  description?: string;
}
