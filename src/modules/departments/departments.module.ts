import { Module } from '@nestjs/common';
import { DepartmentsService } from './services/departments.service';
import { DepartmentsController } from './controllers/departments.controller';
import { CentersModule } from '../centers/centers.module';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  IsValidCenterConfigConstraint,
  IsValidNameDepartmentConstraint,
} from './validators';

@Module({
  imports: [CentersModule],
  controllers: [DepartmentsController],
  providers: [
    PrismaService,
    DepartmentsService,
    IsValidCenterConfigConstraint,
    IsValidNameDepartmentConstraint,
  ],
  exports: [
    DepartmentsService,
    IsValidCenterConfigConstraint,
    IsValidNameDepartmentConstraint,
  ],
})
export class DepartmentsModule {}
