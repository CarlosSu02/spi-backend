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
import { CreateConditionDto, UpdateConditionDto } from '../dto';
import { ConditionsService } from '../services/conditions.service';

@Controller('conditions')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class ConditionsController {
  constructor(private readonly conditionService: ConditionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  create(@Body() createConditionDto: CreateConditionDto) {
    return this.conditionService.create(createConditionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.conditionService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.conditionService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateConditionDto: UpdateConditionDto,
  ) {
    return this.conditionService.update(id, updateConditionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.conditionService.remove(id);
  }
}
