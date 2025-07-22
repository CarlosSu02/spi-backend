import { Module } from '@nestjs/common';
import { CentersService } from './services/centers.service';
import { CentersController } from './controllers/centers.controller';
import { FacultiesController } from './controllers/faculties.controller';
import { FacultiesService } from './services/faculties.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CentersController, FacultiesController],
  providers: [PrismaService, CentersService, FacultiesService],
  exports: [CentersService, FacultiesService],
})
export class CentersModule {}
