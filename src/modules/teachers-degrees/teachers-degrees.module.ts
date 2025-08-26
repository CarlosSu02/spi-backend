import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeachersModule } from '../teachers/teachers.module';
import { PostgradsController } from './controllers/postgrads.controller';
import { TeachersPostgradController } from './controllers/teachers-postgrad.controller';
import { TeachersUndergradController } from './controllers/teachers-undergrad.controller';
import { UndergradsController } from './controllers/undergrads.controller';
import { PostgradsService } from './services/postgrads.service';
import { TeachersPostgradService } from './services/teachers-postgrad.service';
import { TeachersUndergradService } from './services/teachers-undergrad.service';
import { UndergradsService } from './services/undergrads.service';

@Module({
  imports: [forwardRef(() => TeachersModule)],
  controllers: [
    PostgradsController,
    TeachersPostgradController,
    UndergradsController,
    TeachersUndergradController,
  ],
  providers: [
    PrismaService,
    PostgradsService,
    TeachersPostgradService,
    UndergradsService,
    TeachersUndergradService,
  ],
  exports: [
    TeachersPostgradService,
    PostgradsService,
    TeachersUndergradService,
    UndergradsService,
  ],
})
export class TeachersDegreesModule {}
