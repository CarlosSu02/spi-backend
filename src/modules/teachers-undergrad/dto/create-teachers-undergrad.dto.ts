import { IsString, IsNotEmpty, Length } from 'class-validator';

// @ValidatorConstraint({ async: true })
// @Injectable()
// export class IsValidUndergradDegreeConstraint
//   implements ValidatorConstraintInterface
// {
//   private cache = new Map<string, string[]>();
//
//   constructor(private prisma: PrismaService) {}
//
//   async validate(grad: string, args: ValidationArguments) {
//     const [degreeType] = args.constraints as EDegreeType[];
//     grad = normalizeText(grad);
//
//     if (this.cache.has(degreeType)) {
//       return this.cache.get(degreeType)?.includes(grad);
//     }
//
//     let results: { name: string }[];
//
//     if (degreeType === EDegreeType.UNDERGRAD) {
//       results = await this.prisma.undergraduate_Degree.findMany({
//         select: {
//           name: true,
//         },
//       });
//
//       const array = results.map((el) => normalizeText(el.name));
//
//       this.cache.set(degreeType, array);
//
//       return array.includes(grad);
//     }
//
//     console.log(degreeType);
//     return true;
//   }
//
//   defaultMessage(args: ValidationArguments) {
//     // here you can provide default error message if validation failed
//     return 'Text ($value) is too short or too long!';
//   }
// }
//
// export function IsValidUndergradDegree(degreeType: EDegreeType) {
//   return function (object: object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       constraints: [degreeType],
//       validator: IsValidUndergradDegreeConstraint,
//     });
//   };
// }

export class CreateTeachersUndergradDto {
  @IsString({
    message: 'La propiedad <name> debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'La propiedad <name> no debe estar vacía.' })
  @Length(1, 100, {
    message: 'La propiedad <name> debe tener entre 1 y 100 caracteres.',
  })
  name: string;
}
