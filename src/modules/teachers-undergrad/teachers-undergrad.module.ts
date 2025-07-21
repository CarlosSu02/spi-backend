import { forwardRef, Module } from '@nestjs/common';
import { UndergradsService } from './services/undergrads.service';
import { UndergradsController } from './controllers/undergrads.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeachersUndergradController } from './controllers/teachers-undergrad.controller';
import { TeachersUndergradService } from './services/teachers-undergrad.service';
import { TeachersModule } from '../teachers/teachers.module';

@Module({
  imports: [forwardRef(() => TeachersModule)],
  controllers: [UndergradsController, TeachersUndergradController],
  providers: [PrismaService, UndergradsService, TeachersUndergradService],
  exports: [TeachersUndergradService, UndergradsService],
})
export class TeachersUndergradModule {}
