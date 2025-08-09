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
import { CreatePostgradDto } from '../dto/create-postgrad.dto';
import { UpdatePostgradDto } from '../dto/update-postgrad.dto';
import { PostgradsService } from '../services/postgrads.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('postgrads')
@Roles(
  EUserRole.ADMIN,
  EUserRole.RRHH,
  EUserRole.DIRECCION,
  EUserRole.DOCENTE,
  EUserRole.COORDINADOR_AREA,
)
export class TeachersPostgradController {
  constructor(private readonly teachersPostgradService: PostgradsService) {}

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado la relación docente-postgrado.')
  @ApiBody({
    type: CreatePostgradDto,
    description: 'Datos para crear una relación docente-postgrado.',
  })
  @ApiCommonResponses({
    summary: 'Crear relación docente-postgrado',
    createdDescription: 'Relación creada exitosamente.',
    badRequestDescription: 'Datos inválidos para crear la relación.',
    internalErrorDescription: 'Error interno al crear la relación.',
  })
  create(@Body() createTeachersPostgradDto: CreatePostgradDto) {
    return this.teachersPostgradService.create(createTeachersPostgradDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Listado de relaciones docente-postgrado obtenidas correctamente.',
  )
  @ApiCommonResponses({
    summary: 'Obtener todas las relaciones docente-postgrado',
    okDescription: 'Listado obtenido correctamente.',
    badRequestDescription: 'Solicitud inválida para obtener las relaciones.',
    internalErrorDescription: 'Error interno al obtener las relaciones.',
    notFoundDescription: 'No se encontraron relaciones.',
  })
  findAll() {
    return this.teachersPostgradService.findAll();
  }

  @Get('array')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de relaciones docente-postgrado en formato array.')
  findAllArray() {
    return this.teachersPostgradService.findAllArray();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Relación docente-postgrado obtenida correctamente.')
  @ApiCommonResponses({
    summary: 'Obtener relación docente-postgrado por ID',
    okDescription: 'Relación obtenida correctamente.',
    badRequestDescription: 'ID inválido para obtener la relación.',
    internalErrorDescription: 'Error interno al obtener la relación.',
    notFoundDescription: 'No se encontró la relación solicitada.',
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.teachersPostgradService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Relación docente-postgrado actualizada correctamente.')
  @ApiBody({
    type: UpdatePostgradDto,
    description: 'Datos para actualizar una relación docente-postgrado.',
  })
  @ApiCommonResponses({
    summary: 'Actualizar relación docente-postgrado por ID',
    okDescription: 'Relación actualizada correctamente.',
    badRequestDescription: 'Datos inválidos para actualizar la relación.',
    internalErrorDescription: 'Error interno al actualizar la relación.',
    notFoundDescription: 'No se encontró la relación a actualizar.',
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateTeachersPostgradDto: UpdatePostgradDto,
  ) {
    return this.teachersPostgradService.update(id, updateTeachersPostgradDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Relación docente-postgrado eliminada correctamente.')
  @ApiCommonResponses({
    summary: 'Eliminar relación docente-postgrado por ID',
    okDescription: 'Relación eliminada correctamente.',
    badRequestDescription: 'ID inválido para eliminar la relación.',
    internalErrorDescription: 'Error interno al eliminar la relación.',
    notFoundDescription: 'No se encontró la relación a eliminar.',
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.teachersPostgradService.remove(id);
  }
}
