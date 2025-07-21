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
import { CreatePostgradDto } from '../dto/create-postgrad.dto';
import { UpdatePostgradDto } from '../dto/update-postgrad.dto';
import { PostgradsService } from '../services/postgrads.service';

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
  create(@Body() createTeachersPostgradDto: CreatePostgradDto) {
    return this.teachersPostgradService.create(createTeachersPostgradDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.teachersPostgradService.findAll();
  }

  @Get('array')
  @HttpCode(HttpStatus.OK)
  findAllArray() {
    return this.teachersPostgradService.findAllArray();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.teachersPostgradService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.OK)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateTeachersPostgradDto: UpdatePostgradDto,
  ) {
    return this.teachersPostgradService.update(id, updateTeachersPostgradDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
  @HttpCode(HttpStatus.OK)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.teachersPostgradService.remove(id);
  }
}
