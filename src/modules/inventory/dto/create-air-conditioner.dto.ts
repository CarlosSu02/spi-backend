import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateAirConditionerDto {
  @IsString({
    message: 'La propiedad <description> debe ser una cadena de caracteres.',
  })
  @IsOptional()
  description?: string;

  @IsUUID('all', { message: 'La propiedad <brandId> debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'La propiedad <brandId> no debe estar vacía.' })
  brandId: string;

  @IsUUID('all', {
    message: 'La propiedad <conditionId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <conditionId> no debe estar vacía.' })
  conditionId: string;

  @IsUUID('all', {
    message: 'La propiedad <classroomId> debe ser un UUID válido.',
  })
  @IsOptional()
  classroomId?: string;
}
