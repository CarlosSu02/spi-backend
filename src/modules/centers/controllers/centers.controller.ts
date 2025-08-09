import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiCommonResponses } from 'src/common/decorators/api-response.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { ApiBody } from '@nestjs/swagger';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CreateCenterDto } from '../dto/create-center.dto';
import { UpdateCenterDto } from '../dto/update-center.dto';
import { CentersService } from '../services/centers.service';
import { EUserRole } from 'src/common/enums';
import { Roles } from 'src/common/decorators';
import { ValidateIdPipe } from 'src/common/pipes';

@Controller('centers')
@Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
export class CentersController {
  constructor(private readonly centersService: CentersService) {}

  @Post()
  @ResponseMessage('Centro creado exitosamente. Devuelve el centro creado.')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: CreateCenterDto,
    description: 'Datos para crear un centro',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Crear centro',
    description: 'Crea un nuevo centro en el sistema.',
    createdDescription: 'Centro creado exitosamente.',
    badRequestDescription: 'Datos inválidos para la creación del centro.',
    internalErrorDescription: 'Error interno al crear el centro.',
    notFoundDescription: 'No se encontró el recurso solicitado.',
  })
  create(@Body() createCenterDto: CreateCenterDto) {
    return this.centersService.create(createCenterDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar centros',
    description: 'Obtiene la lista de todos los centros registrados.',
  })
  @ApiOkResponse({
    description: 'Lista de centros obtenida correctamente.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno al obtener los centros.',
  })
  @ApiNotFoundResponse({
    description: 'No se encontraron centros.',
  })
  findAll() {
    return this.centersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiCommonResponses({
    summary: 'Obtener centro por ID',
    description: 'Obtiene la información de un centro específico por su ID.',
    createdDescription: 'Centro obtenido correctamente.',
    badRequestDescription: 'ID de centro inválido.',
    internalErrorDescription: 'Error interno al obtener el centro.',
    notFoundDescription: 'No se encontró el centro solicitado.',
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.centersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Centro actualizado exitosamente. Devuelve el centro actualizado.',
  )
  @ApiBody({
    type: UpdateCenterDto,
    description: 'Datos para actualizar un centro',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Actualizar centro',
    description: 'Actualiza la información de un centro existente.',
    createdDescription: 'Centro actualizado correctamente.',
    badRequestDescription: 'Datos inválidos para la actualización.',
    internalErrorDescription: 'Error interno al actualizar el centro.',
    notFoundDescription: 'No se encontró el centro solicitado.',
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateCenterDto: UpdateCenterDto,
  ) {
    return this.centersService.update(id, updateCenterDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiCommonResponses({
    summary: 'Eliminar centro',
    description: 'Elimina un centro del sistema por su ID.',
    createdDescription: 'Centro eliminado correctamente.',
    badRequestDescription: 'ID de centro inválido.',
    internalErrorDescription: 'Error interno al eliminar el centro.',
    notFoundDescription: 'No se encontró el centro solicitado.',
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.centersService.remove(id);
  }
}
