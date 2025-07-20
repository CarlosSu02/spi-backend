import { Module } from '@nestjs/common';
import { TeachersService } from './services/teachers.service';
import { TeachersController } from './contollers/teachers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeachersUndergradService } from '../teachers-undergrad/services/teachers-undergrad.service';
import { IsValidGradDegreeConstraint } from './validators';
// import { IsValidUndergradDegreeConstraint } from './dto/create-teacher.dto';

@Module({
  controllers: [TeachersController],
  providers: [
    PrismaService,
    TeachersService,
    TeachersUndergradService,
    IsValidGradDegreeConstraint,
  ],
})
export class TeachersModule {}
