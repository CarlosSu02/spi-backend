import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateMultimediaTypeDto {
  @ApiProperty({
    description: 'Descripción del tipo de multimedia.',
    example: 'PDF',
  })
  @IsString({
    message: 'La propiedad <description> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({
    message: 'La propiedad <descriptionType> no debe estar vacía.',
  })
  @Length(3, 250, {
    message: 'La propiedad <description> debe tener entre 3 y 250 caracteres.',
  })
  description: string;
}
