import { Module } from '@nestjs/common';
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
