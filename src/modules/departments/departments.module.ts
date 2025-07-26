import { Module } from '@nestjs/common';
import { DepartmentsService } from './services/departments.service';
import { DepartmentsController } from './controllers/departments.controller';
import { CentersModule } from '../centers/centers.module';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  IsValidCenterConfigConstraint,
  IsValidNameDepartmentConstraint,
} from './validators';
import { IsValidDepartmentIdConstraint } from './validators/is-valid-department-id.validator';
import { FacultiesService } from './services/faculties.service';
import { FacultiesController } from './controllers/faculties.controller';

@Module({
  imports: [CentersModule],
  controllers: [DepartmentsController, FacultiesController],
  providers: [
    PrismaService,
    DepartmentsService,
    FacultiesService,
    IsValidCenterConfigConstraint,
    IsValidNameDepartmentConstraint,
    IsValidDepartmentIdConstraint,
  ],
  exports: [
    DepartmentsService,
    FacultiesService,
    IsValidCenterConfigConstraint,
    IsValidNameDepartmentConstraint,
    IsValidDepartmentIdConstraint,
  ],
})
export class DepartmentsModule {}
