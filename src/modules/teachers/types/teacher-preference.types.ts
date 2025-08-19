import { TCourse } from 'src/modules/course-classrooms/types';

export type TTeacherPreference = {
  id: string;
  teacherId: string;
  startTime: string | Date;
  endTime: string | Date;
  preferredClasses: TTeacherPreferredClass[];
};

export type TTeacherPreferredClass = {
  id: string;
  courseId: string;
  teacherPreferenceId: string;
  course: TCourse;
};
