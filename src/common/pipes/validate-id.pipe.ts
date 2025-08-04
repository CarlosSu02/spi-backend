import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidateIdPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    const keys = Object.keys(value);
    const idKey = value[keys[0]];
    const id = idKey ? idKey : value.id;

    if (
      !id
        .toString()
        .match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g,
        )
    )
      throw new BadRequestException('Id no válido.');

    return id;
  }
}
