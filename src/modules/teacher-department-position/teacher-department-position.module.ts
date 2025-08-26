import { Module } from '@nestjs/common';
import { TeacherDepartmentPositionService } from './services/teacher-department-position.service';
import { TeacherDepartmentPositionController } from './contollers/teacher-department-position.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeachersModule } from '../teachers/teachers.module';
import { DepartmentsModule } from '../departments/departments.module';
import { TeachersConfigModule } from '../teachers-config/teachers-config.module';

@Module({
  imports: [TeachersModule, TeachersConfigModule, DepartmentsModule],
  controllers: [TeacherDepartmentPositionController],
  providers: [PrismaService, TeacherDepartmentPositionService],
  exports: [TeacherDepartmentPositionService],
})
export class TeacherDepartmentPositionModule {}
