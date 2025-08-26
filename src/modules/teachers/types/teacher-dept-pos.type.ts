import { TDepartment } from 'src/modules/departments/types';
import { TPosition } from 'src/modules/teachers-config/types';
import { TTeacher } from 'src/modules/teachers/types';

export type TTeacherDeptPos = {
  id: string;
  teacherId?: string;
  departmentId?: string;
  positionId?: string;
  // createdAt: string;
  startDate: Date;
  endDate: Date | null;
  department?: Omit<TDepartment, 'uvs' | 'centerId' | 'facultyId'>;
  teacher?: Pick<TTeacher, 'id'>;
};

// Tipo para la creación
export type TCreateTeacherDeptPos = Omit<
  TTeacherDeptPos,
  | 'startDate' // lo agrega la base de datos
  | 'endDate'
  | 'id'
>;

export type TTeacherInclude = TTeacherDeptPos & {
  position: TPosition;
  department: Pick<TDepartment, 'id' | 'name'>;
  teacher: {
    id: string;
    user: {
      id: string;
      name: string;
      code: string;
    };
  };
};
