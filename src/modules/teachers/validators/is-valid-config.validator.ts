import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EConfigType } from '../enums';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidConfigConstraint implements ValidatorConstraintInterface {
  async validate(
    config: EConfigType,
    args: ValidationArguments,
  ): Promise<boolean> {
    return false;
  }

  defaultMessage(args?: ValidationArguments): string {
    return '$value';
  }
}
