import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  Length,
  Validate,
} from 'class-validator';
import { ValidatorConstraintDecorator } from 'src/common/decorators';
import { IsValidDepartmentIdConstraint } from 'src/modules/departments/validators/is-valid-department-id.validator';
import { EInventoryConfig } from '../enums';
import { IsValidIdsInventoryConfigConstraint } from '../validators';

export class CreatePcEquipmentDto {
  @IsString({
    message:
      'La propiedad <inventoryNumber> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({
    message: 'La propiedad <inventoryNumber> no debe estar vacía.',
  })
  @Length(1, 50, {
    message:
      'La propiedad <inventoryNumber> debe tener entre 1 y 50 caracteres.',
  })
  inventoryNumber: string;

  @IsString({
    message: 'La propiedad <processor> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <processor> no debe estar vacía.' })
  @Length(1, 100, {
    message: 'La propiedad <processor> debe tener entre 1 y 100 caracteres.',
  })
  processor: string;

  @IsString({
    message: 'La propiedad <ram> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <ram> no debe estar vacía.' })
  @Length(1, 50, {
    message: 'La propiedad <ram> debe tener entre 1 y 50 caracteres.',
  })
  ram: string;

  @IsString({
    message: 'La propiedad <disk> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <disk> no debe estar vacía.' })
  @Length(1, 100, {
    message: 'La propiedad <disk> debe tener entre 1 y 100 caracteres.',
  })
  disk: string;

  @IsUUID('all', { message: 'La propiedad <brandId> debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'La propiedad <brandId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    EInventoryConfig.BRAND,
    IsValidIdsInventoryConfigConstraint,
  )
  brandId: string;

  @IsUUID('all', {
    message: 'La propiedad <conditionId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <conditionId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    EInventoryConfig.CONDITION,
    IsValidIdsInventoryConfigConstraint,
  )
  conditionId: string;

  @IsUUID('all', {
    message: 'La propiedad <monitorTypeId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <monitorTypeId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    EInventoryConfig.MONITOR_TYPE,
    IsValidIdsInventoryConfigConstraint,
  )
  monitorTypeId: string;

  @IsUUID('all', {
    message: 'La propiedad <monitorSizeId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <monitorSizeId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    EInventoryConfig.MONITOR_SIZE,
    IsValidIdsInventoryConfigConstraint,
  )
  monitorSizeId: string;

  @IsUUID('all', {
    message: 'La propiedad <pcTypeId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <pcTypeId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    EInventoryConfig.PC_TYPE,
    IsValidIdsInventoryConfigConstraint,
  )
  pcTypeId: string;

  @IsUUID('all', {
    message: 'La propiedad <classroomId> debe ser un UUID válido.',
  })
  @IsOptional()
  @ValidatorConstraintDecorator(
    EInventoryConfig.CLASSROOM,
    IsValidIdsInventoryConfigConstraint,
  )
  classroomId?: string;

  @IsUUID('all', {
    message: 'La propiedad <departmentId> debe ser un UUID válido.',
  })
  @IsOptional()
  @Validate(IsValidDepartmentIdConstraint)
  departmentId?: string;
}
