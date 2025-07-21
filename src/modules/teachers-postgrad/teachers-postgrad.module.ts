import { forwardRef, Module } from '@nestjs/common';
import { PostgradsService } from './services/postgrads.service';
import { PostgradsController } from './controllers/postgrads.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeachersModule } from '../teachers/teachers.module';
import { TeachersPostgradService } from './services/teachers-postgrad.service';
import { TeachersPostgradController } from './controllers/teachers-postgrad.controller';

@Module({
  imports: [forwardRef(() => TeachersModule)],
  controllers: [PostgradsController, TeachersPostgradController],
  providers: [PrismaService, PostgradsService, TeachersPostgradService],
  exports: [TeachersPostgradService, PostgradsService],
})
export class TeachersPostgradModule {}
