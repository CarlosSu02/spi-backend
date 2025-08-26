import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Validate,
  ValidateIf,
} from 'class-validator';
import { EConfigType, EDegreeType } from '../enums';
import {
  IsValidConfigTeacherConstraint,
  IsValidGradDegreeConstraint,
  IsValidUserIdConstraint,
} from '../validators';
import { ValidatorConstraintDecorator } from 'src/common/decorators';
import { IsValidPositionIdConstraint } from 'src/modules/teachers-config/validators';
import { IsValidDepartmentIdConstraint } from 'src/modules/centers/validators';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'UUID del pregrado.',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
    required: true,
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <undergradId> debe ser un UUID válido.',
  })
  @ValidatorConstraintDecorator(
    EDegreeType.UNDERGRAD,
    IsValidGradDegreeConstraint,
  )
  undergradId: string;

  @ApiPropertyOptional({
    description: 'UUID del posgrado.',
    example: 'b2c3d4e5-f6a1-7890-abcd-1234567890ab',
  })
  @IsOptional()
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <postgradId> debe ser un UUID válido.',
  })
  @ValidatorConstraintDecorator(
    EDegreeType.POSTGRAD,
    IsValidGradDegreeConstraint,
  )
  postgradId?: string;

  @ApiProperty({
    description: 'UUID de la categoría.',
    example: 'c3d4e5f6-a1b2-7890-abcd-1234567890ab',
    required: true,
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <categoryId> debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'La propiedad <categoryId> no debe estar vacía.',
  })
  @ValidatorConstraintDecorator(
    EConfigType.CATEGORY,
    IsValidConfigTeacherConstraint,
  )
  categoryId: string;

  @ApiProperty({
    description: 'UUID del tipo de contrato.',
    example: 'd4e5f6a1-b2c3-7890-abcd-1234567890ab',
    required: true,
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <contractTypeId> debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'La propiedad <contractTypeId> no debe estar vacía.',
  })
  @ValidatorConstraintDecorator(
    EConfigType.CONTRACT,
    IsValidConfigTeacherConstraint,
  )
  contractTypeId: string;

  @ApiProperty({
    description: 'UUID del turno.',
    example: 'e5f6a1b2-c3d4-7890-abcd-1234567890ab',
    required: true,
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <shiftId> debe ser un UUID válido versión.',
  })
  @IsNotEmpty({
    message: 'La propiedad <shiftId> no debe estar vacía.',
  })
  @ValidatorConstraintDecorator(
    EConfigType.SHIFT,
    IsValidConfigTeacherConstraint,
  )
  shiftId: string;

  @ApiProperty({
    description: 'UUID del usuario.',
    example: 'f6a1b2c3-d4e5-7890-abcd-1234567890ab',
    required: true,
  })
  @ValidateIf((o: CreateTeacherDto) => !o.currentUserId)
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <userId> debe ser un UUID válido.',
  })
  @Validate(IsValidUserIdConstraint)
  userId: string;

  // @ApiPropertyOptional({
  //   description: 'UUID del usuario actual.',
  //   example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  // })
  @IsOptional()
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <currentUserId> debe ser un UUID válido.',
  })
  @Validate(IsValidUserIdConstraint)
  currentUserId?: string;

  @IsOptional()
  @IsUUID()
  @Validate(IsValidDepartmentIdConstraint)
  departmentId: string;

  @IsOptional()
  @IsUUID()
  @Validate(IsValidPositionIdConstraint)
  positionId: string;
}
