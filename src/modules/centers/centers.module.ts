import { Module } from '@nestjs/common';
import { CentersService } from './services/centers.service';
import { CentersController } from './controllers/centers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepartmentsModule } from '../departments/departments.module';

@Module({
  controllers: [CentersController],
  providers: [PrismaService, CentersService],
  exports: [CentersService],
})
export class CentersModule {}
