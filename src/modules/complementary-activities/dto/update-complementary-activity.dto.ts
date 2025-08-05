import { PartialType } from '@nestjs/mapped-types';
import { CreateComplementaryActivityDto } from './create-complementary-activity.dto';

export class UpdateComplementaryActivityDto extends PartialType(
  CreateComplementaryActivityDto,
) {}
