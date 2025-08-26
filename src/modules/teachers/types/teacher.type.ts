import { TCustomOmit, TCustomPick } from 'src/common/types';
import { TDepartmentJoin } from 'src/modules/departments/types';
import { TPosition } from 'src/modules/positions/types';
import {
  TContractType,
  TShift,
  TTeacherCategory,
} from 'src/modules/teachers-config/types';
import {
  TPostgraduateDegree,
  TUndergraduateDegree,
} from 'src/modules/teachers-degrees/types';
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
  user: TCustomPick<TUser, 'id' | 'code' | 'name'> & {
    email?: string;
  };
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
