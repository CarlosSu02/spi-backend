import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateTeacherDto } from 'src/modules/teachers/dto/update-teacher.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean({
    message: 'La propiedad <activeStatus> debe ser un booleano <true/false>.',
  })
  @IsOptional()
  activeStatus: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateTeacherDto)
  teacher?: UpdateTeacherDto;
}
