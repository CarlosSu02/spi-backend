import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validateUuid } from '../utils';

@Injectable()
export class ValidateGlobalIdsPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (!value) return value;

    for (const [key, val] of Object.entries(value)) {
      if (
        key.toLocaleLowerCase().includes('id') &&
        (typeof val !== 'string' || !validateUuid(val))
      )
        // if (!validateUuid(value))
        throw new BadRequestException(
          `El campo <${key}> debe ser un uuid válido.`,
        );
    }

    return value;
  }
}
