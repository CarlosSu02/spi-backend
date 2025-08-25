import { TDepartment } from 'src/modules/departments/types';
import { TTeacher } from 'src/modules/teachers/types';
import { TAcademicPeriod } from './academid-period.type';
import { TTeachingSession } from './teaching-session.type';
import { TUser } from 'src/modules/users/types';

export type TAcademicAssignmentReport = {
  id: string;
  teacherId?: string;
  departmentId?: string;
  periodId: string;
  department?: Pick<TDepartment, 'id' | 'name'>;
  teacher?: Pick<TTeacher, 'id'> & {
    user: Pick<TUser, 'id' | 'name' | 'code'>;
  };
  period?: TAcademicPeriod;
  // complementaryActivities?: TComplementaryActivity[];
  teachingSession?: TTeachingSession | null;
};

// Tipo para la creación
export type TCreateAcademicAssignmentReport = Omit<
  TAcademicAssignmentReport,
  // 'id' |
  'department' | 'teacher' | 'period' | 'complementaryActivities'
  // | 'teachingSessions'
>;

// Tipo para la actualización
export type TUpdateAcademicAssignmentReport =
  Partial<TCreateAcademicAssignmentReport>;
