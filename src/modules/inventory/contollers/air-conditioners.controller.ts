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
import { AirConditionersService } from '../services/air-conditioners.service';
import { CreateAirConditionerDto, UpdateAirConditionerDto } from '../dto';

@Controller('air-conditioners')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class AirConditionersController {
  constructor(
    private readonly airConditionersService: AirConditionersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  create(@Body() createAirConditionerDto: CreateAirConditionerDto) {
    return this.airConditionersService.create(createAirConditionerDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.airConditionersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.airConditionersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateAirConditionerDto: UpdateAirConditionerDto,
  ) {
    return this.airConditionersService.update(id, updateAirConditionerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.airConditionersService.remove(id);
  }
}
