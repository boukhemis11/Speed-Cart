import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { existsSync } from 'fs';

const staticFile = existsSync(join(process.cwd(), '../dist/speed-cart/browser'))
  ? join(process.cwd(), '../dist/speed-cart/browser')
  : join(process.cwd(), 'public');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),

    AuthModule,

    ServeStaticModule.forRoot({
      rootPath: staticFile,
      exclude: ['/api'],
    }),
  ],
  exports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
