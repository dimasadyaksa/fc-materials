import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe(
      {
        transform: true,
        transformOptions:{
          enableImplicitConversion: true
        }
      }
    )
  )

  app.enableVersioning({
    // host:port/<version>/route
    type: VersioningType.URI,
    defaultVersion: '1' // host:port/v1/route
  })

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();