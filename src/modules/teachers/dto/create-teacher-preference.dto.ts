import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsDateString, IsArray } from 'class-validator';

export class CreateTeacherPreferenceDto {
  @ApiProperty({
    description: 'ID del docente a agregar las preferencias.',
    example: '65039ef6-1fc5-474c-b4e3-27239c200138',
    required: true,
  })
  @IsUUID('all', {
    each: true,
    message: 'La propiedad <teacherId> debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'La propiedad <teacherId> no debe estar vacía.',
  })
  teacherId: string;

  @ApiProperty({
    description:
      'Hora de inicio de jornada (fecha y hora), sólo se toma la hora después.',
    example: '2025-08-09T16:00:00Z',
  })
  @IsDateString(
    {},
    {
      message: 'La propiedad <startTime> debe ser una fecha con hora válida.',
    },
  )
  @IsNotEmpty({
    message: 'La propiedad <startTime> no debe estar vacía.',
  })
  startTime: string;

  @ApiProperty({
    description:
      'Hora de finalización de jornada (fecha y hora), sólo se toma la hora después.',
    example: '2025-08-09T16:00:00Z',
  })
  @IsDateString(
    {},
    {
      message: 'La propiedad <endTime> debe ser una fecha con hora válida.',
    },
  )
  @IsNotEmpty({
    message: 'La propiedad <endTime> no debe estar vacía.',
  })
  endTime: string;

  // codigos de clase en un array?
  // TODO: Se pueden comprobar mediante un validator constraint!
  @ApiProperty({
    description: 'Clases de preferencia del docente (solamente 5).',
    type: 'array',
    items: { type: 'string', format: 'string' },
    maxItems: 5,
    required: true,
    nullable: false,
  })
  @IsArray({
    message:
      'Las preferencias de clases deben mandarse en un arreglo con los códigos. Ejemplo: ["IS...", "IS..."]',
  })
  @IsNotEmpty({
    message: 'El docente debe elegir al menos una clase de preferencia.',
  })
  preferredClasses: string[];
}
