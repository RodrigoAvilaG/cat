import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- 1. Importamos esto

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  // 2. Activamos la validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Esto elimina automáticamente cualquier dato basura que nos envíen y no esté en el DTO
    forbidNonWhitelisted: true, // Si nos mandan datos de más, rechaza la petición
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();