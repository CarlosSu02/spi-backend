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
import { CreateUndergradDto } from '../dto/create-undergrad.dto';
import { UpdateUndergradDto } from '../dto/update-undergrad.dto';
import { UndergradsService } from '../services/undergrads.service';
import { EUserRole } from 'src/common/enums';
import { Roles } from 'src/common/decorators';
import { ValidateIdPipe } from 'src/common/pipes';

@Controller('teachers-undergrad')
@Roles(
  EUserRole.ADMIN,
  EUserRole.RRHH,
  EUserRole.DIRECCION,
  EUserRole.DOCENTE,
  EUserRole.COORDINADOR_AREA,
)
export class UndergradsController {
  constructor(private readonly teachersUndergradService: UndergradsService) {}

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTeachersUndergradDto: CreateUndergradDto) {
    return this.teachersUndergradService.create(createTeachersUndergradDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.teachersUndergradService.findAll();
  }

  @Get('array')
  @HttpCode(HttpStatus.OK)
  findAllArray() {
    return this.teachersUndergradService.findAllArray();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.teachersUndergradService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.OK)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateTeachersUndergradDto: UpdateUndergradDto,
  ) {
    return this.teachersUndergradService.update(id, updateTeachersUndergradDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.OK)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.teachersUndergradService.remove(id);
  }
}
