import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from 'src/modules/users/services/users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidUserIdConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(userId: string, args: ValidationArguments): Promise<boolean> {
    return !!(await this.usersService.findOne(userId));
  }
}
