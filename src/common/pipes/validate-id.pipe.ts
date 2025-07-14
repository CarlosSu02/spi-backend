import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidateIdPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    const id = value.id.toString();

    if (
      !id.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g,
      )
    )
      throw new BadRequestException('Id no válido.');

    return id;
  }
}
