import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

import * as cors from 'cors';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const logger = new Logger('boostrap');


  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


  app.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN,
    }),
  );






  const port = process.env.PORT;
  await app.listen(port);
  logger.log('App listening on port b ' + port);
}

bootstrap();
