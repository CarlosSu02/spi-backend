export type TCourseClassroom = {
  id: string;
  courseId: string;
  classroomId: string;
  teachingSessionId: string;
  section: string;
  days: string;
  studentCount: number;
  modalityId: string;
  nearGraduation: boolean;
  groupCode: string;
  observation?: string | null;
  // course?: TCourse;
  // classroom?: TClassroom;
  // teachingSession?: TTeachingSession;
  // modality?: TModality;
  // courseStatistics?: TCourseStatistic[];
};

// Tipo para la creación
export type TCreateCourseClassroom = Omit<
  TCourseClassroom,
  | 'id'
  | 'course'
  | 'classroom'
  | 'teachingSession'
  | 'modality'
  | 'courseStatistics'
>;

// Tipo para la actualización
export type TUpdateCourseClassroom = Partial<TCreateCourseClassroom> & {
  id: string;
};
