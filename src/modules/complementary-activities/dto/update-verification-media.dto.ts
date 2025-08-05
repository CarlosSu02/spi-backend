import { PartialType } from '@nestjs/swagger';
import { CreateVerificationMediaDto } from './create-verification-media.dto';

export class UpdateVerificationMediaDto extends PartialType(
  CreateVerificationMediaDto,
) {}
