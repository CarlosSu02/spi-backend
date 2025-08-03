export type TTeacherDeptPos = {
  id: string;
  teacherId?: string;
  departmentId?: string;
  positionId?: string;
  // createdAt: string;
  startDate: Date;
  endDate: Date | null;
};

// Tipo para la creación
export type TCreateTeacherDeptPos = Omit<
  TTeacherDeptPos,
  | 'startDate' // lo agrega la base de datos
  | 'endDate'
  | 'id'
>;
