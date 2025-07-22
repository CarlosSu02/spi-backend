import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ECenterConfig } from '../enums';
import { CentersService } from 'src/modules/centers/services/centers.service';
import { FacultiesService } from 'src/modules/centers/services/faculties.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidCenterConfigConstraint
  implements ValidatorConstraintInterface
{
  private cache = new Map<string, string[]>();

  constructor(
    private readonly centersService: CentersService,
    private readonly facultiesService: FacultiesService,
  ) {}

  async validate(
    configId: string,
    args: ValidationArguments,
  ): Promise<boolean> {
    const [configType] = args.constraints as ECenterConfig[];

    if (this.cache.has(configType))
      return this.cache.get(configType)!.includes(configId);

    let validIds: string[] = [];

    if (configType === ECenterConfig.CENTER) {
      validIds = await this.getCentersIds();
    }

    if (configType === ECenterConfig.FACULTY) {
      validIds = await this.getFacultiesIds();
    }

    if (validIds.length === 0) return false;

    this.cache.set(configType, validIds);

    return validIds.includes(configId);
  }

  async getCentersIds(): Promise<string[]> {
    const centers = await this.centersService.findAll();
    return centers.map((el) => el.id);
  }

  async getFacultiesIds(): Promise<string[]> {
    const faculties = await this.facultiesService.findAll();
    return faculties.map((el) => el.id);
  }

  defaultMessage(args: ValidationArguments): string {
    const [configType] = args.constraints as ECenterConfig[];
    const configs: { [key: string]: { name: string; endpoint: string } } = {
      [ECenterConfig.CENTER]: { name: 'centros', endpoint: '/centers' },
      [ECenterConfig.FACULTY]: {
        name: 'facultades',
        endpoint: '/faculties',
      },
    };

    return `El ${args.property} <$value> no fue encontrado en <${configs[configType].name}>, por favor consulte los disponibles en <${configs[configType].endpoint}>.`;
  }
}

export function IsValidCenterConfig(configType: ECenterConfig) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [configType],
      validator: IsValidCenterConfigConstraint,
    });
  };
}
