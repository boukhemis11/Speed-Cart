import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppSSRModule } from './app-ssr.module';
import { Logger } from '@nestjs/common';

import * as mongoose from 'mongoose';

import * as cors from 'cors';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const logger = new Logger('boostrap');


  const app = await NestFactory.create<NestExpressApplication>(AppSSRModule);
  app.use(compression());
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


  app.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN,
    }),
  );

  if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.set('useFindAndModify', false);
  }



  const port = parseInt(process.env.PORT, 1000) || 4000;
  await app.listen(port);
  logger.log('App listening on port production ' + port || 4000);
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  bootstrap().catch((err) => console.error(err));
}
