import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  // API-first (TR-03): every capability is exposed and documented as an endpoint so third parties,
  // the MCP server and our own frontends all use the same contract.
  const openapi = new DocumentBuilder()
    .setTitle('Intuitive Fusion API')
    .setDescription('Conversational procurement & contract lifecycle management')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, openapi));

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log(`Intuitive Fusion API listening on :${port} (OpenAPI at /docs)`);
}

void bootstrap();
