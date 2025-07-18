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
import { CreateContractTypeDto } from '../dto/create-contract-type.dto';
import { UpdateContractTypeDto } from '../dto/update-contract-type.dto';
import { ContractTypesService } from '../services/contract-types.service';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';

@Controller('contract-types')
@Roles(EUserRole.ADMIN, EUserRole.RRHH, EUserRole.DIRECCION)
export class ContractTypesController {
  constructor(private readonly contractTypesService: ContractTypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createContractTypeDto: CreateContractTypeDto) {
    return this.contractTypesService.create(createContractTypeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.contractTypesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.contractTypesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateContractTypeDto: UpdateContractTypeDto,
  ) {
    return this.contractTypesService.update(id, updateContractTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.contractTypesService.remove(id);
  }
}
