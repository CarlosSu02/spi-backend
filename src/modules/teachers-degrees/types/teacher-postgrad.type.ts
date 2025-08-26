import { TTeacher } from 'src/modules/teachers/types';
import { TPostgraduateDegree } from './postgrad.type';

export type TTeacherPostgrad = {
  teacherId: string;
  postgraduateId: string;
  postgraduate?: TPostgraduateDegree;
  teacher?: Omit<TTeacher, 'postgradId' | 'undergradId'>;
};

// export type TTeacherUndergradWithInclude = TTeacherUndergrad & {
//   undergraduate: TUndergraduateDegree;
//   teacher: Omit<TTeacher, 'undergradId'>;
// };
