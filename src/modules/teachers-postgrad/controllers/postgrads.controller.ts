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
import { CreatePostgradDto } from '../dto/create-postgrad.dto';
import { UpdatePostgradDto } from '../dto/update-postgrad.dto';
import { PostgradsService } from '../services/postgrads.service';
import { EUserRole } from 'src/common/enums';
import { Roles } from 'src/common/decorators';
import { ValidateIdPipe } from 'src/common/pipes';
import { TeachersPostgradService } from '../services/teachers-postgrad.service';

@Controller('teachers-postgrad')
@Roles(
  EUserRole.ADMIN,
  EUserRole.RRHH,
  EUserRole.DIRECCION,
  EUserRole.DOCENTE,
  EUserRole.COORDINADOR_AREA,
)
export class PostgradsController {
  constructor(
    private readonly postgradsService: PostgradsService,
    private readonly teachersUndegradService: TeachersPostgradService,
  ) {}

  @Post()
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostgradDto: CreatePostgradDto) {
    return this.postgradsService.create(createPostgradDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.teachersUndegradService.findAll();
  }

  @Get('array')
  @HttpCode(HttpStatus.OK)
  findAllArray() {
    return this.postgradsService.findAllArray();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.postgradsService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.OK)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updatePostgradDto: UpdatePostgradDto,
  ) {
    return this.postgradsService.update(id, updatePostgradDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.OK)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.postgradsService.remove(id);
  }
}
