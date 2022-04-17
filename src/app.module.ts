import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtModule } from './art/art.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PropositionModule } from './proposition/proposition.module';
import { FavoritesModule } from './favorites/favorites.module';
import { TrophieModule } from './trophie/trophie.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: parseInt(process.env.PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      migrations: ['../dist/src/db/migrations/*.js'],
      cli: {
        migrationsDir: '../src/db/migrations',
      },
    }),
    ArtModule,
    AuthModule,
    PropositionModule,
    FavoritesModule,
    TrophieModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
