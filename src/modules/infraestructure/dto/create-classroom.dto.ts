import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';
import { IsValidIdsClassroomConfigConstraint } from '../validators';
import { EClassroomConfig } from '../enums';
import { ValidatorConstraintDecorator } from 'src/common/decorators';

// TODO: AGREGAR LOS VALIDATORS-CONTRAINTS PARA LOS ID'S. 2025-07-26 16:44
// Uno solo, con enum
export class CreateClassroomDto {
  @IsString({
    message: 'La propiedad <name> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <name> no debe estar vacía.' })
  @Length(1, 100, {
    message: 'La propiedad <name> debe tener entre 1 y 100 caracteres.',
  })
  name: string;

  @IsInt({ message: 'La propiedad <desks> debe ser un número entero.' })
  @IsNotEmpty({ message: 'La propiedad <desks> no debe estar vacía.' })
  desks: number;

  @IsInt({ message: 'La propiedad <tables> debe ser un número entero.' })
  @IsNotEmpty({ message: 'La propiedad <tables> no debe estar vacía.' })
  tables: number;

  @IsInt({ message: 'La propiedad <powerOutlets> debe ser un número entero.' })
  @IsNotEmpty({ message: 'La propiedad <powerOutlets> no debe estar vacía.' })
  powerOutlets: number;

  @IsInt({ message: 'La propiedad <lights> debe ser un número entero.' })
  @IsNotEmpty({ message: 'La propiedad <lights> no debe estar vacía.' })
  lights: number;

  @IsInt({ message: 'La propiedad <blackboards> debe ser un número entero.' })
  @IsNotEmpty({ message: 'La propiedad <blackboards> no debe estar vacía.' })
  blackboards: number;

  @IsInt({ message: 'La propiedad <lecterns> debe ser un número entero.' })
  @IsNotEmpty({ message: 'La propiedad <lecterns> no debe estar vacía.' })
  lecterns: number;

  @IsInt({ message: 'La propiedad <windows> debe ser un número entero.' })
  @IsNotEmpty({ message: 'La propiedad <windows> no debe estar vacía.' })
  windows: number;

  @IsUUID('all', {
    message: 'La propiedad <buildingId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <buildingId> no debe estar vacía.' })
  // @IsValidIdsClassroomConfig(EClassroomConfig.BUILDING)
  @ValidatorConstraintDecorator(
    EClassroomConfig.BUILDING,
    IsValidIdsClassroomConfigConstraint,
  )
  buildingId: string;

  @IsUUID('all', {
    message: 'La propiedad <roomTypeId> debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'La propiedad <roomTypeId> no debe estar vacía.' })
  // @IsValidIdsClassroomConfig(EClassroomConfig.ROOM_TYPE)
  @ValidatorConstraintDecorator(
    EClassroomConfig.ROOM_TYPE,
    IsValidIdsClassroomConfigConstraint,
  )
  roomTypeId: string;

  @IsUUID('all', {
    message: 'La propiedad <connectivityId> debe ser un UUID válido.',
  })
  @IsOptional()
  // @IsValidIdsClassroomConfig(EClassroomConfig.CONNECTIVITY)
  @ValidatorConstraintDecorator(
    EClassroomConfig.CONNECTIVITY,
    IsValidIdsClassroomConfigConstraint,
  )
  connectivityId?: string;

  @IsUUID('all', {
    message: 'La propiedad <audioEquipmentId> debe ser un UUID válido.',
  })
  @IsOptional()
  // @IsValidIdsClassroomConfig(EClassroomConfig.AUDIO_EQUIPMENT)
  @ValidatorConstraintDecorator(
    EClassroomConfig.AUDIO_EQUIPMENT,
    IsValidIdsClassroomConfigConstraint,
  )
  audioEquipmentId?: string;
}
