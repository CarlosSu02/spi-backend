import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import { TeachersUndergradService } from 'src/modules/teachers-undergrad/services/teachers-undergrad.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EDegreeType } from '../enums';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidGradDegreeConstraint
  implements ValidatorConstraintInterface
{
  // Considerar que si alguien mas agrega otro, es probable que no se vea reflejado.
  // Es probable que se elimine.
  private cache = new Map<string, string[]>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly undergradService: TeachersUndergradService,
  ) {}

  async validate(gradId: string, args: ValidationArguments): Promise<boolean> {
    const [degreeType] = args.constraints as EDegreeType[];

    if (this.cache.has(degreeType))
      return this.cache.get(degreeType)!.includes(gradId);

    let results: { id: string }[];

    if (degreeType === EDegreeType.UNDERGRAD) {
      // results = await this.prisma.undergraduate_Degree.findMany({
      //   select: {
      //     id: true,
      //   },
      // });
      results = await this.undergradService.findAll();

      const array = results.map((el) => el.id);

      this.cache.set(degreeType, array);

      return array.includes(gradId);
    }

    if (degreeType === EDegreeType.POSTGRAD) {
      results = await this.prisma.postgraduate_Degree.findMany({
        select: {
          id: true,
        },
      });

      const array = results.map((el) => el.id);

      this.cache.set(degreeType, array);

      return array.includes(gradId);
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const [degreeType] = args.constraints as EDegreeType[];
    const type = degreeType === EDegreeType.UNDERGRAD;

    return `El ${args.property} <$value> no fue encontrado en <${type ? 'pregrados' : 'postgrados'}>, por favor consulte los disponibles en <${type ? '/teachers-undergrad' : '/teachers-postgrad'}>.`;
  }
}

export function IsValidGradDegree(degreeType: EDegreeType) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [degreeType],
      validator: IsValidGradDegreeConstraint,
    });
  };
}
