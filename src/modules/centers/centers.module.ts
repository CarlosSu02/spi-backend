import { Module } from '@nestjs/common';
import { CentersService } from './services/centers.service';
import { CentersController } from './controllers/centers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FacultiesController } from './controllers/faculties.controller';
import { DepartmentsService } from './services/departments.service';
import { FacultiesService } from './services/faculties.service';
import {
  IsValidCenterConfigConstraint,
  IsValidNameDepartmentConstraint,
} from './validators';
import { IsValidDepartmentIdConstraint } from './validators/is-valid-department-id.validator';
import { DepartmentsController } from './controllers/departments.controller';

@Module({
  controllers: [CentersController, DepartmentsController, FacultiesController],
  providers: [
    PrismaService,
    CentersService,
    DepartmentsService,
    FacultiesService,
    IsValidCenterConfigConstraint,
    IsValidNameDepartmentConstraint,
    IsValidDepartmentIdConstraint,
  ],
  exports: [
    CentersService,
    DepartmentsService,
    FacultiesService,
    IsValidCenterConfigConstraint,
    IsValidNameDepartmentConstraint,
    IsValidDepartmentIdConstraint,
  ],
})
export class CentersModule {}
