export type TTeacherDeptPos = {
  id: string;
  teacherId?: string;
  departmentId?: string;
  positionId?: string;
  // createdAt: string;
  startDate: Date;
  endDate: Date | null;
};
