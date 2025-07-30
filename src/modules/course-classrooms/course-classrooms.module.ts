import { Module } from '@nestjs/common';
import { CourseClassroomsController } from './contollers/course-classrooms.controller';
import { CourseStadisticsController } from './contollers/course-stadistics.controller';
import { CoursesController } from './contollers/courses.controller';
import { ModalitiesController } from './contollers/modalities.controller';
import { CourseClassroomsService } from './services/course-classrooms.service';
import { CourseStadisticsService } from './services/course-stadistics.service';
import { CoursesService } from './services/courses.service';
import { ModalitiesService } from './services/modalities.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ExistsCodeCourseValidator,
  IsValidClassroomConfigConstraint,
} from './validators';

@Module({
  controllers: [
    CourseClassroomsController,
    CoursesController,
    ModalitiesController,
    CourseStadisticsController,
  ],
  providers: [
    PrismaService,
    CourseClassroomsService,
    CoursesService,
    ModalitiesService,
    CourseStadisticsService,
    IsValidClassroomConfigConstraint,
    ExistsCodeCourseValidator,
  ],
  exports: [
    CourseClassroomsService,
    CoursesService,
    ModalitiesService,
    CourseStadisticsService,
    IsValidClassroomConfigConstraint,
    ExistsCodeCourseValidator,
  ],
})
export class CourseClassroomsModule {}
