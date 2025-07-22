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
import { FacultiesService } from '../services/faculties.service';
import { CreateFacultyDto } from '../dto/create-faculty.dto';
import { UpdateFacultyDto } from '../dto/update-faculty.dto';
import { ValidateIdPipe } from 'src/common/pipes';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';

@Controller('faculties')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.facultiesService.create(createFacultyDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.facultiesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.facultiesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ) {
    return this.facultiesService.update(id, updateFacultyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.facultiesService.remove(id);
  }
}
