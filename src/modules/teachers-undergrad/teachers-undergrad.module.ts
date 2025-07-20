import { Module } from '@nestjs/common';
import { TeachersUndergradService } from './services/teachers-undergrad.service';
import { TeachersUndergradController } from './controllers/teachers-undergrad.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TeachersUndergradController],
  providers: [PrismaService, TeachersUndergradService],
})
export class TeachersUndergradModule {}
