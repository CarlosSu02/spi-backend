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

@Module({
  imports: [CentersModule],
  controllers: [DepartmentsController],
  providers: [
    PrismaService,
    DepartmentsService,
    IsValidCenterConfigConstraint,
    IsValidNameDepartmentConstraint,
    IsValidDepartmentIdConstraint,
  ],
  exports: [
    DepartmentsService,
    IsValidCenterConfigConstraint,
    IsValidNameDepartmentConstraint,
    IsValidDepartmentIdConstraint,
  ],
})
export class DepartmentsModule {}
