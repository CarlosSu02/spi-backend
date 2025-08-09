import { PrismaService } from 'src/prisma/prisma.service';
import { ComplementaryActivitiesController } from './controllers/complementary-activities.controller';
import { MultimediaTypesController } from './controllers/multimedia-types.controller';
import { VerificationMediasController } from './controllers/verification-medias.controller';
import { ComplementaryActivitiesService } from './services/complementary-activities.service';
import { MultimediaTypesService } from './services/multimedia-types.service';
import { VerificationMediasService } from './services/verification-medias.service';
import { IsValidComplementaryActivityConfigConstraint } from './validators';
import { Module } from '@nestjs/common';
import { ActivityTypesService } from './services/activity-types.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ActivityTypesController } from './controllers/activity-types.controller';

@Module({
  imports: [CloudinaryModule],
  controllers: [
    ComplementaryActivitiesController,
    VerificationMediasController,
    MultimediaTypesController,
    ActivityTypesController
  ],
  providers: [
    PrismaService,
    ActivityTypesService,
    VerificationMediasService,
    MultimediaTypesService,
    ComplementaryActivitiesService,
    IsValidComplementaryActivityConfigConstraint,
  ],
  exports: [
    ActivityTypesService,
    VerificationMediasService,
    MultimediaTypesService,
    ComplementaryActivitiesService,
  ],
})
export class ComplementaryActivitiesModule { }
