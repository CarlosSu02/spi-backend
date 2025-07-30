// validator constraint para buscar si ya existe un código de curso y no permitir duplicados
import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CoursesService } from '../services/courses.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistsCodeCourseValidator implements ValidatorConstraintInterface {
  constructor(private readonly coursesService: CoursesService) {}

  async validate(code: string, args: ValidationArguments): Promise<boolean> {
    if (!code || code === '') return true;

    if (typeof code !== 'string') return false;

    const course = await this.coursesService.findOneByCode(code);
    return !course;
  }

  defaultMessage(args: ValidationArguments): string {
    return `Ya existe un curso con el código <${args.value}>`;
  }
}
