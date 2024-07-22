import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';

import { CustomResFilter } from './custom-res.filter';


export async function httpBootstrap(module: unknown, globalPrefix: string) {
  const app = await NestFactory.create<NestFastifyApplication>(
    module,
    new FastifyAdapter()
  );

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new CustomResFilter());

  const config = new DocumentBuilder()
    .setTitle('Fast Pro')
    .setDescription('Procurement software for enterprise')
    .setVersion('1.0')
    .addTag('Auth')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.init();


  return app;
}
