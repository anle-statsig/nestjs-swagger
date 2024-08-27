import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { patchNestjsSwagger } from './patch-nest-swagger';
import { z } from 'zod'

extendZodWithOpenApi(z)

// To export the global override of Zod types
export type { ZodOpenAPIMetadata } from '@asteasolutions/zod-to-openapi'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .addBearerAuth()
    .build();
    
  patchNestjsSwagger();
  // await SwaggerModule.loadPluginMetadata(metadata);

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
