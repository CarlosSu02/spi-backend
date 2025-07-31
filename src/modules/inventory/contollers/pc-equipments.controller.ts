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
  Query,
} from '@nestjs/common';
import { ApiPagination, ResponseMessage, Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { PcEquipmentsService } from '../services/pc-equipments.service';
import { CreatePcEquipmentDto, UpdatePcEquipmentDto } from '../dto';
import { QueryPaginationDto } from 'src/common/dto';

@Controller('pc-equipments')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class PcEquipmentsController {
  constructor(private readonly pcEquipmentsService: PcEquipmentsService) {}

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado un equipo de computo.')
  create(@Body() createPcEquipmentDto: CreatePcEquipmentDto) {
    return this.pcEquipmentsService.create(createPcEquipmentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de equipos de computo.')
  @ApiPagination({
    summary: 'Obtener todos los equipos de computo',
    description: 'Devuelve una lista de todos los equipos de computo.',
  })
  findAll(@Query() query: QueryPaginationDto) {
    return this.pcEquipmentsService.findAllWithPagination(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha encontrado el equipo de computo.')
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.pcEquipmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha actualizado el equipo de computo.')
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updatePcEquipmentDto: UpdatePcEquipmentDto,
  ) {
    return this.pcEquipmentsService.update(id, updatePcEquipmentDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado el equipo de computo.')
  remove(@Param(ValidateIdPipe) id: string) {
    return this.pcEquipmentsService.remove(id);
  }
}
