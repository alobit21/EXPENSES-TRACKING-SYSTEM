import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // frontend URL
    allowedHeaders: ['Content-Type', 'Authorization'], // required for JWT
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    console.log('CORS enabled for http://localhost:5173')
  });

  await app.listen(process.env.PORT ?? 3000,'0.0.0.0');
}
bootstrap();
