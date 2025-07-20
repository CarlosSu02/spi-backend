import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { EDegreeType } from '../enums';
import { IsValidGradDegree } from '../validators';

export class CreateTeacherDto {
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <undergradId> debe ser un UUID válido.',
  })
  @IsValidGradDegree(EDegreeType.UNDERGRAD)
  undergradId: string;

  @IsOptional()
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <undergradId> debe ser un UUID válido.',
  })
  @IsValidGradDegree(EDegreeType.POSTGRAD)
  postgradId?: string;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <categoryId> debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'La propiedad <categoryId> no debe estar vacía.',
  })
  categoryId: string;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <contractTypeId> debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'La propiedad <contractTypeId> no debe estar vacía.',
  })
  contractTypeId: string;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <shiftId> debe ser un UUID válido versión.',
  })
  @IsNotEmpty({
    message: 'La propiedad <shiftId> no debe estar vacía.',
  })
  shiftId: string;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <userId> debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'La propiedad <userId> no debe estar vacía.',
  })
  userId: string;
}
