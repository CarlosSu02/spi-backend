import { TDepartment } from 'src/modules/centers/types';

export type TOutputCourseWithSelect = {
  id: string;
  code: string;
  departmentId: string;
  activeStatus: boolean;
  department: Omit<TDepartment, 'uvs' | 'centerId' | 'facultyId'>;
};
