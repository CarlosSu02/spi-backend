import { TTeacher } from 'src/modules/teachers/types';
import { TUndergraduateDegree } from './undergrad.type';

export type TTeacherUndergrad = {
  teacherId: string;
  undergraduateId: string;
  undergraduate?: TUndergraduateDegree;
  teacher?: Omit<TTeacher, 'undergradId'>;
};

// export type TTeacherUndergradWithInclude = TTeacherUndergrad & {
//   undergraduate: TUndergraduateDegree;
//   teacher: Omit<TTeacher, 'undergradId'>;
// };
