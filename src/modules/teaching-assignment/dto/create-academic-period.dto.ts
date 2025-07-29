import {
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsString,
  // IsIn,
  IsEnum,
} from 'class-validator';
import { EModality } from '../enums';

export class CreateAcademicPeriodDto {
  @IsInt({ message: 'La propiedad <year> debe ser un número entero.' })
  @Min(2000, { message: 'La propiedad <year> debe ser mayor o igual a 2000.' })
  @Max(2100, { message: 'La propiedad <year> debe ser menor o igual a 2100.' })
  @IsNotEmpty({ message: 'La propiedad <year> no debe estar vacía.' })
  year: number;

  @IsInt({ message: 'La propiedad <pac> debe ser un número entero.' })
  @Min(1, { message: 'La propiedad <pac> debe ser mayor o igual a 1.' })
  @Max(3, { message: 'La propiedad <pac> debe ser menor o igual a 3.' })
  @IsNotEmpty({ message: 'La propiedad <pac> no debe estar vacía.' })
  pac: number;

  @IsString({
    message: 'La propiedad <pac_modality> debe ser una cadena de caracteres.',
  })
  // @IsIn(['Trimestre', 'Semestre'], {
  //   message: 'La propiedad <pac_modality> debe ser "Trimestre" o "Semestre".',
  // })
  @IsEnum(EModality, {
    message: `La modalidad debe ser uno de los siguientes: ${Object.values(EModality).join(', ')}`,
  })
  @IsNotEmpty({ message: 'La propiedad <pac_modality> no debe estar vacía.' })
  pac_modality: string;
}
