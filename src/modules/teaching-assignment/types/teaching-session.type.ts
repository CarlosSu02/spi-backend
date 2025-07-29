export type TTeachingSession = {
  id: string;
  consultHour?: Date | null;
  tutoringHour?: Date | null;
  assignmentReportId: string;
  // assignmentReport?: TAcademicAssignmentReport;
  // courseClassrooms?: TCourseClassroom[];
};

// Tipo para la creación
export type TCreateTeachingSession = Omit<
  TTeachingSession,
  'id' | 'assignmentReport' | 'courseClassrooms'
>;

// Tipo para la actualización
export type TUpdateTeachingSession = Partial<TCreateTeachingSession>;
