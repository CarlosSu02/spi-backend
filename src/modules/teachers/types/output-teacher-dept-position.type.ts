export type TOutputTeacherDeptPos = {
  id: string;
  userId?: string;
  teacherId?: string;
  code: string;
  name?: string;
  departmentId?: string;
  departmentName?: string;
  positionId?: string;
  positionName?: string;
  // createdAt: string;
  startDate: Date | string;
  endDate: Date | string | null;
};
