import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/v1/api');

  // app.useGlobalPipes(new ValidateGlobalIdsPipe());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // const reflector = new Reflector();
  // app.useGlobalInterceptors(new TransformInterceptor());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Sistema de Planificación Integral (SPI)')
    .setDescription('Proyecto TE&A')
    .setVersion('1.0')
    .addTag('spi')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese el access-token',
        name: 'JWT',
        in: 'header',
      },
      'jwt',
    )
    .addSecurityRequirements('jwt')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
