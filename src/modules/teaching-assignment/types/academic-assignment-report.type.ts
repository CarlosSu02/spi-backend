import { TDepartment } from 'src/modules/departments/types';
import { TTeacher } from 'src/modules/teachers/types';
import { TAcademicPeriod } from './academid-period.type';
import { TTeachingSession } from './teaching-session.type';

export type TAcademicAssignmentReport = {
  id: string;
  teacherId: string;
  departmentId: string;
  periodId: string;
  department?: TDepartment;
  teacher?: TTeacher;
  period?: TAcademicPeriod;
  // complementaryActivities?: TComplementaryActivity[];
  teachingSessions?: TTeachingSession[];
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
