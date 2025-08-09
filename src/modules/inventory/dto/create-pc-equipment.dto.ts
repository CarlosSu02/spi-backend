import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  Length,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidatorConstraintDecorator } from 'src/common/decorators';
import { IsValidDepartmentIdConstraint } from 'src/modules/departments/validators/is-valid-department-id.validator';
import { EInventoryConfig } from '../enums';
import { IsValidIdsInventoryConfigConstraint } from '../validators';

export class CreatePcEquipmentDto {
  @ApiProperty({ example: 'INV-001', required: true, description: 'Número de inventario del equipo.' })
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

  @ApiProperty({ example: 'Intel Core i5', required: true, description: 'Procesador del equipo.' })
  @IsString({
    message: 'La propiedad <processor> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <processor> no debe estar vacía.' })
  @Length(1, 100, {
    message: 'La propiedad <processor> debe tener entre 1 y 100 caracteres.',
  })
  processor: string;

  @ApiProperty({ example: '8GB', required: true, description: 'Memoria RAM del equipo.' })
  @IsString({
    message: 'La propiedad <ram> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <ram> no debe estar vacía.' })
  @Length(1, 50, {
    message: 'La propiedad <ram> debe tener entre 1 y 50 caracteres.',
  })
  ram: string;

  @ApiProperty({ example: 'SSD 256GB', required: true, description: 'Disco duro del equipo.' })
  @IsString({
    message: 'La propiedad <disk> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <disk> no debe estar vacía.' })
  @Length(1, 100, {
    message: 'La propiedad <disk> debe tener entre 1 y 100 caracteres.',
  })
  disk: string;

  @ApiProperty({ example: 'uuid-brand', required: true, description: 'ID de la marca.' })
  @IsUUID('all', { message: 'La propiedad <brandId> debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'La propiedad <brandId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    EInventoryConfig.BRAND,
    IsValidIdsInventoryConfigConstraint,
  )
  brandId: string;

  @ApiProperty({ example: 'uuid-condition', required: true, description: 'ID de la condición.' })
  @IsUUID('all', {
    message: 'La propiedad <conditionId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <conditionId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    EInventoryConfig.CONDITION,
    IsValidIdsInventoryConfigConstraint,
  )
  conditionId: string;

  @ApiProperty({ example: 'uuid-monitor-type', required: true, description: 'ID del tipo de monitor.' })
  @IsUUID('all', {
    message: 'La propiedad <monitorTypeId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <monitorTypeId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    EInventoryConfig.MONITOR_TYPE,
    IsValidIdsInventoryConfigConstraint,
  )
  monitorTypeId: string;

  @ApiProperty({ example: 'uuid-monitor-size', required: true, description: 'ID del tamaño de monitor.' })
  @IsUUID('all', {
    message: 'La propiedad <monitorSizeId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <monitorSizeId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    EInventoryConfig.MONITOR_SIZE,
    IsValidIdsInventoryConfigConstraint,
  )
  monitorSizeId: string;

  @ApiProperty({ example: 'uuid-pc-type', required: true, description: 'ID del tipo de PC.' })
  @IsUUID('all', {
    message: 'La propiedad <pcTypeId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <pcTypeId> no debe estar vacía.' })
  @ValidatorConstraintDecorator(
    EInventoryConfig.PC_TYPE,
    IsValidIdsInventoryConfigConstraint,
  )
  pcTypeId: string;

  @ApiProperty({ example: 'uuid-classroom', required: false, description: 'ID del aula.' })
  @IsUUID('all', {
    message: 'La propiedad <classroomId> debe ser un UUID válido.',
  })
  @IsOptional()
  @ValidatorConstraintDecorator(
    EInventoryConfig.CLASSROOM,
    IsValidIdsInventoryConfigConstraint,
  )
  classroomId?: string;

  @ApiProperty({ example: 'uuid-department', required: false, description: 'ID del departamento.' })
  @IsUUID('all', {
    message: 'La propiedad <departmentId> debe ser un UUID válido.',
  })
  @IsOptional()
  @Validate(IsValidDepartmentIdConstraint)
  departmentId?: string;
}
