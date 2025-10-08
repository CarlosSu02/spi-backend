import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const logger = new Logger('DB');

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // constructor() {
  //   const url: string = process.env.DATABASE_URL;
  //   super({
  //     datasources: {
  //       db: {
  //         url,
  //       },
  //     },
  //   });
  // }

  async onModuleInit() {
    await this.$connect();
    logger.log('Database <postgres> connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
