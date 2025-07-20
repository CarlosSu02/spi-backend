import { PartialType } from '@nestjs/mapped-types';
import { CreateTeachersUndergradDto } from './create-teachers-undergrad.dto';

export class UpdateTeachersUndergradDto extends PartialType(CreateTeachersUndergradDto) {}
