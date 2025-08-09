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
import { ApiBody } from '@nestjs/swagger';
import { ApiCommonResponses, ResponseMessage } from 'src/common/decorators';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { CreateBrandDto, UpdateBrandDto } from '../dto';
import { BrandsService } from '../services/brands.service';

@Controller('brands')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Marca creada exitosamente. Devuelve la marca creada.')
  @ApiBody({
    type: CreateBrandDto,
    description: 'Datos para crear una marca',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Crear marca',
    description: 'Crea una nueva marca.',
    createdDescription: 'Marca creada correctamente.',
    badRequestDescription: 'Datos inválidos para la creación.',
    internalErrorDescription: 'Error interno al crear la marca.',
    notFoundDescription: 'No se encontró el recurso solicitado.'
  })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Lista de marcas obtenida exitosamente.')
  @ApiCommonResponses({
    summary: 'Listar marcas',
    description: 'Obtiene todas las marcas registradas.',
    createdDescription: 'Marcas obtenidas correctamente.',
    badRequestDescription: 'Solicitud inválida.',
    internalErrorDescription: 'Error interno al obtener las marcas.',
    notFoundDescription: 'No se encontraron marcas.'
  })
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Marca obtenida exitosamente.')
  @ApiCommonResponses({
    summary: 'Obtener marca',
    description: 'Obtiene una marca por su ID.',
    createdDescription: 'Marca obtenida correctamente.',
    badRequestDescription: 'ID inválido.',
    internalErrorDescription: 'Error interno al obtener la marca.',
    notFoundDescription: 'No se encontró la marca solicitada.'
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.brandsService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Marca actualizada exitosamente. Devuelve la marca actualizada.')
  @ApiBody({
    type: UpdateBrandDto,
    description: 'Datos para actualizar una marca',
    required: true,
  })
  @ApiCommonResponses({
    summary: 'Actualizar marca',
    description: 'Actualiza la información de una marca existente.',
    createdDescription: 'Marca actualizada correctamente.',
    badRequestDescription: 'Datos inválidos para la actualización.',
    internalErrorDescription: 'Error interno al actualizar la marca.',
    notFoundDescription: 'No se encontró la marca solicitada.'
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Marca eliminada exitosamente.')
  @ApiCommonResponses({
    summary: 'Eliminar marca',
    description: 'Elimina una marca por su ID.',
    createdDescription: 'Marca eliminada correctamente.',
    badRequestDescription: 'ID inválido.',
    internalErrorDescription: 'Error interno al eliminar la marca.',
    notFoundDescription: 'No se encontró la marca solicitada.'
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.brandsService.remove(id);
  }
}
