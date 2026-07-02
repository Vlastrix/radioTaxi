import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`\n======================================================`);
  console.log(`Backend (API) is running on: http://localhost:3000/`);
  console.log(`Frontend (Sitio Web) is on: http://localhost:5173/`);
  console.log(`======================================================\n`);
}
bootstrap();
