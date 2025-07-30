export class AcademicAssignmentDto {
  id: number;
  teacherCode: string;
  teacherName: string;
  courseCodeSummary: string;
  courseCode: string;
  section: string;
  uv: number;
  days: string;
  studentCount: number;
  classroomName: string;
  department: string;
  coordinator: string;
  center: string;
  observation?: string;
}

export type TAcademicAssignment = Record<number, keyof AcademicAssignmentDto>;

export const propertiesAcademicAssignment: TAcademicAssignment = {
  0: 'id',
  1: 'teacherCode',
  2: 'teacherName',
  3: 'courseCodeSummary',
  4: 'courseCode',
  5: 'section',
  6: 'uv',
  7: 'days',
  8: 'studentCount',
  9: 'classroomName',
  10: 'department',
  11: 'coordinator',
  12: 'center',
  13: 'observation',
};
