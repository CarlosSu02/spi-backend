import { TCustomOmit, TCustomPick } from 'src/common/types';
import { TCenter } from 'src/modules/centers/types';
import {
  TDepartment,
  TDepartmentJoin,
  TFaculty,
} from 'src/modules/departments/types';
import { TPosition } from 'src/modules/positions/types';
import {
  TContractType,
  TShift,
  TTeacherCategory,
} from 'src/modules/teachers-config/types';
import { TPostgraduateDegree } from 'src/modules/teachers-postgrad/types';
import { TUndergraduateDegree } from 'src/modules/teachers-undergrad/types';
import { TUser } from 'src/modules/users/types';

export type TTeacher = {
  id: string;
  undergradId: string;
  postgradId?: string;
  categoryId: string;
  contractTypeId: string;
  shiftId: string;
};

export type TTeacherJoin = TCustomOmit<
  TTeacher,
  'undergradId' | 'postgradId'
> & {
  category: TTeacherCategory;
  shift: TShift;
  contractType: TContractType;
  user: TCustomPick<TUser, 'id' | 'code' | 'name'>;
  undergradDegrees: {
    teacherId: string;
    undergraduateId: string;
    undergraduate: TPostgraduateDegree;
  }[];
  postgraduateDegrees: {
    teacherId: string;
    postgraduateId: string;
    postgraduate: TUndergraduateDegree;
  }[];
  positionHeld: {
    department: TDepartmentJoin;
    position: TPosition;
  }[];
};
