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
import { CreateTeachersUndergradDto } from '../dto/create-teachers-undergrad.dto';
import { UpdateTeachersUndergradDto } from '../dto/update-teachers-undergrad.dto';
import { TeachersUndergradService } from '../services/teachers-undergrad.service';
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
export class TeachersUndergradController {
  constructor(
    private readonly teachersUndergradService: TeachersUndergradService,
  ) {}

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTeachersUndergradDto: CreateTeachersUndergradDto) {
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
    @Body() updateTeachersUndergradDto: UpdateTeachersUndergradDto,
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
