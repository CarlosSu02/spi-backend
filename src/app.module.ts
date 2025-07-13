import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [
    {
      // automatic inject reflector
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
