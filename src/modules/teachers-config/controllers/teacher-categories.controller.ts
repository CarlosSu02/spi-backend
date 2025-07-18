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
import { CreateTeacherCategoryDto } from '../dto/create-teacher-category.dto';
import { UpdateTeacherCategoryDto } from '../dto/update-teacher-category.dto';
import { TeacherCategoriesService } from '../services/teacher-categories.service';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';

@Controller('teacher-categories')
@Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
export class TeacherCategoriesController {
  constructor(
    private readonly teacherCategoriesService: TeacherCategoriesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createTeacherCategoryDto: CreateTeacherCategoryDto) {
    return this.teacherCategoriesService.create(createTeacherCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.teacherCategoriesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.teacherCategoriesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateTeacherCategoryDto: UpdateTeacherCategoryDto,
  ) {
    return this.teacherCategoriesService.update(id, updateTeacherCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.teacherCategoriesService.remove(id);
  }
}
