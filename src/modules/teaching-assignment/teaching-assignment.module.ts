import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AcademicPeriodsController } from './controllers/academic-periods.controller';
import { AssignmentReportsController } from './controllers/academic-assignment-reports.controller';
import { AcademicPeriodsService } from './services/academic-periods.service';
import { AcademicAssignmentReportsService } from './services/academic-assignment-reports.service';
import { TeachingSessionsService } from './services/teaching-sessions.service';
import { TeachingSessionsController } from './controllers/teaching-sessions.controller';
import { TeachersModule } from '../teachers/teachers.module';
import { IsValidIdsTeachingAssignmentConfigConstraint } from './validators';
import { ExcelFilesModule } from '../excel-files/excel-files.module';
import { CourseClassroomsModule } from '../course-classrooms/course-classrooms.module';
import { InfraestructureModule } from '../infraestructure/infraestructure.module';
import { TeachersConfigModule } from '../teachers-config/teachers-config.module';
import { CentersModule } from '../centers/centers.module';

@Module({
  imports: [
    TeachersModule,
    TeachersConfigModule,
    CentersModule,
    ExcelFilesModule,
    CourseClassroomsModule,
    InfraestructureModule,
  ],
  controllers: [
    AcademicPeriodsController,
    AssignmentReportsController,
    TeachingSessionsController,
  ],
  providers: [
    PrismaService,
    AcademicPeriodsService,
    AcademicAssignmentReportsService,
    TeachingSessionsService,
    IsValidIdsTeachingAssignmentConfigConstraint,
  ],
  exports: [
    AcademicPeriodsService,
    AcademicAssignmentReportsService,
    TeachingSessionsService,
  ],
})
export class TeachingAssignmentModule {}
