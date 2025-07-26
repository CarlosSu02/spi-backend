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
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { CreateAudioEquipmentDto, UpdateAudioEquipmentDto } from '../dto';
import { AudioEquipmentService } from '../services/audio-equipment.service';

@Controller('audio-equipments')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class AudioEquipmentController {
  constructor(private readonly audioEquipmentService: AudioEquipmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  create(@Body() createAudioEquipmentDto: CreateAudioEquipmentDto) {
    return this.audioEquipmentService.create(createAudioEquipmentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.audioEquipmentService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.audioEquipmentService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateAudioEquipmentDto: UpdateAudioEquipmentDto,
  ) {
    return this.audioEquipmentService.update(id, updateAudioEquipmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.audioEquipmentService.remove(id);
  }
}
