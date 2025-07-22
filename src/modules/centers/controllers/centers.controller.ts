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
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCenterDto: CreateCenterDto) {
    return this.centersService.create(createCenterDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.centersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.centersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateCenterDto: UpdateCenterDto,
  ) {
    return this.centersService.update(id, updateCenterDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.centersService.remove(id);
  }
}
