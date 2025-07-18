import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AtGuard, RolesGuard } from './common/guards';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TransformInterceptor } from './common/interceptors';
import { TeachersConfigModule } from './modules/teachers-config/teachers-config.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, TeachersConfigModule],
  providers: [
    {
      // automatic inject reflector
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      // automatic inject reflector
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      // automatic inject reflector
      /*
       * para controlar el acceso por roles, este cubre toda la app,
       * pero de ser necesario se puede hacer en los controllers individuales y eliminar este.
       *
       * */
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
