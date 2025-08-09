import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCommonResponses,
  ResponseMessage,
  Roles,
} from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { UndergradsService } from '../services/undergrads.service';
import { ApiBody } from '@nestjs/swagger';
import { CreateUndergradDto, UpdateUndergradDto } from '../dto';

@Controller('undergrads')
@Roles(
  EUserRole.ADMIN,
  EUserRole.RRHH,
  EUserRole.DIRECCION,
  EUserRole.DOCENTE,
  EUserRole.COORDINADOR_AREA,
)
export class TeachersUndergradController {
  constructor(private readonly teachersUndergradService: UndergradsService) {}

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado la relación docente-pregrado.')
  @ApiBody({
    type: CreateUndergradDto,
    description: 'Datos para crear una relación docente-pregrado.',
  })
  @ApiCommonResponses({
    summary: 'Crear relación docente-pregrado',
    createdDescription: 'Relación creada exitosamente.',
    badRequestDescription: 'Datos inválidos para crear la relación.',
    internalErrorDescription: 'Error interno al crear la relación.',
  })
  create(@Body() createTeachersUndergradDto: CreateUndergradDto) {
    return this.teachersUndergradService.create(createTeachersUndergradDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Listado de relaciones docente-pregrado obtenidas correctamente.',
  )
  @ApiCommonResponses({
    summary: 'Obtener todas las relaciones docente-pregrado',
    okDescription: 'Listado obtenido correctamente.',
    badRequestDescription: 'Solicitud inválida para obtener las relaciones.',
    internalErrorDescription: 'Error interno al obtener las relaciones.',
    notFoundDescription: 'No se encontraron relaciones.',
  })
  findAll() {
    return this.teachersUndergradService.findAll();
  }

  @Get('array')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de relaciones docente-pregrado en formato array.')
  findAllArray() {
    return this.teachersUndergradService.findAllArray();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Relación docente-pregrado obtenida correctamente.')
  @ApiCommonResponses({
    summary: 'Obtener relación docente-pregrado por ID',
    okDescription: 'Relación obtenida correctamente.',
    badRequestDescription: 'ID inválido para obtener la relación.',
    internalErrorDescription: 'Error interno al obtener la relación.',
    notFoundDescription: 'No se encontró la relación solicitada.',
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.teachersUndergradService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Relación docente-pregrado actualizada correctamente.')
  @ApiBody({
    type: UpdateUndergradDto,
    description: 'Datos para actualizar una relación docente-pregrado.',
  })
  @ApiCommonResponses({
    summary: 'Actualizar relación docente-pregrado por ID',
    okDescription: 'Relación actualizada correctamente.',
    badRequestDescription: 'Datos inválidos para actualizar la relación.',
    internalErrorDescription: 'Error interno al actualizar la relación.',
    notFoundDescription: 'No se encontró la relación a actualizar.',
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateTeachersUndergradDto: UpdateUndergradDto,
  ) {
    return this.teachersUndergradService.update(id, updateTeachersUndergradDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Relación docente-pregrado eliminada correctamente.')
  @ApiCommonResponses({
    summary: 'Eliminar relación docente-pregrado por ID',
    okDescription: 'Relación eliminada correctamente.',
    badRequestDescription: 'ID inválido para eliminar la relación.',
    internalErrorDescription: 'Error interno al eliminar la relación.',
    notFoundDescription: 'No se encontró la relación a eliminar.',
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.teachersUndergradService.remove(id);
  }
}
