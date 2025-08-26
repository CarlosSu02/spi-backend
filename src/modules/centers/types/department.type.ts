import { TCenter } from 'src/modules/centers/types';
import { TFaculty } from './faculty.type';

export type TDepartment = {
  id: string;
  name: string;
  uvs: number | null;
  centerId: string;
  facultyId: string;
};

export type TDepartmentJoin = TDepartment & {
  center: TCenter;
  faculty: TFaculty;
};
