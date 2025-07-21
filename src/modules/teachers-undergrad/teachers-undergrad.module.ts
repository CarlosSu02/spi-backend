import { Module } from '@nestjs/common';
import { UndergradsService } from './services/undergrads.service';
import { UndergradsController } from './controllers/undergrad.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UndergradsController],
  providers: [PrismaService, UndergradsService],
})
export class TeachersUndergradModule {}
