import { IsNotEmpty, IsInt, IsUUID } from 'class-validator';
import { ValidatorConstraintDecorator } from 'src/common/decorators';
import { IsValidIdsInventoryConfigConstraint } from 'src/modules/inventory/validators';
import { ECourseClassroomConfig } from '../enums';

export class CreateCourseStadisticDto {
  @IsInt({ message: 'La propiedad <APB> debe ser un número entero.' })
  @IsNotEmpty({ message: 'La propiedad <APB> no debe estar vacía.' })
  APB: number = 0;

  @IsInt({ message: 'La propiedad <RPB> debe ser un número entero.' })
  @IsNotEmpty({ message: 'La propiedad <RPB> no debe estar vacía.' })
  RPB: number = 0;

  @IsInt({ message: 'La propiedad <NSP> debe ser un número entero.' })
  @IsNotEmpty({ message: 'La propiedad <NSP> no debe estar vacía.' })
  NSP: number = 0;

  @IsInt({ message: 'La propiedad <ABD> debe ser un número entero.' })
  @IsNotEmpty({ message: 'La propiedad <ABD> no debe estar vacía.' })
  ABD: number = 0;

  @IsUUID('all', {
    each: true,
    message: 'La propiedad <courseClassroomId> debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'La propiedad <courseClassroomId> no debe estar vacía.',
  })
  @ValidatorConstraintDecorator(
    ECourseClassroomConfig.COURSE_CLASSROOM,
    IsValidIdsInventoryConfigConstraint,
  )
  courseClassroomId: string;
}
