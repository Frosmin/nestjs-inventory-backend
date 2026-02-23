import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // prefijo
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true,
    }),
  );

  //SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Inventory API')
    .setDescription('API REST para la gestión de inventarios, productos y órdenes.')
    .setVersion('1')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  // docunmentacion en apidocs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();