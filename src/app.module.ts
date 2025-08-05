import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AtGuard, RolesGuard } from './common/guards';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TransformInterceptor } from './common/interceptors';
import { TeachersConfigModule } from './modules/teachers-config/teachers-config.module';
import { TeachersUndergradModule } from './modules/teachers-undergrad/teachers-undergrad.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { TeachersPostgradModule } from './modules/teachers-postgrad/teachers-postgrad.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { CentersModule } from './modules/centers/centers.module';
import { PositionsModule } from './modules/positions/positions.module';
import { TeacherDepartmentPositionModule } from './modules/teacher-department-position/teacher-department-position.module';
import { InfraestructureModule } from './modules/infraestructure/infraestructure.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { TeachingAssignmentModule } from './modules/teaching-assignment/teaching-assignment.module';
import { ExcelFilesModule } from './modules/excel-files/excel-files.module';
import { CourseClassroomsModule } from './modules/course-classrooms/course-classrooms.module';
import { ComplementaryActivitiesModule } from './modules/complementary-activities/complementary-activities.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    TeachersConfigModule,
    TeachersUndergradModule,
    TeachersPostgradModule,
    TeachersModule,
    DepartmentsModule,
    CentersModule,
    PositionsModule,
    TeacherDepartmentPositionModule,
    InfraestructureModule,
    InventoryModule,
    TeachingAssignmentModule,
    ExcelFilesModule,
    CourseClassroomsModule,
    ComplementaryActivitiesModule,
  ],
  providers: [
    {
      // automatic inject reflector
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      // automatic inject reflector
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      // automatic inject reflector
      /*
       * para controlar el acceso por roles, este cubre toda la app,
       * pero de ser necesario se puede hacer en los controllers individuales y eliminar este.
       *
       * */
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
