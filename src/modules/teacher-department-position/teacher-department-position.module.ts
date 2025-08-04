import { Module } from '@nestjs/common';
import { TeacherDepartmentPositionService } from './services/teacher-department-position.service';
import { TeacherDepartmentPositionController } from './contollers/teacher-department-position.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeachersModule } from '../teachers/teachers.module';
import { PositionsModule } from '../positions/positions.module';
import { DepartmentsModule } from '../departments/departments.module';

@Module({
  imports: [TeachersModule, PositionsModule, DepartmentsModule],
  controllers: [TeacherDepartmentPositionController],
  providers: [PrismaService, TeacherDepartmentPositionService],
  exports: [TeacherDepartmentPositionService],
})
export class TeacherDepartmentPositionModule {}
