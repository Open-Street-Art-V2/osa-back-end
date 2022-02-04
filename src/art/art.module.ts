import { Module } from '@nestjs/common';
import { ArtService } from './art.service';
import { ArtController } from './art.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtRepository } from './art.repository';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import fileName from 'src/utils/file_upload/filename';
import { imageFilter } from 'src/utils/file_upload/filter';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArtRepository]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        fileFilter: imageFilter,
        storage: diskStorage({
          destination: configService.get('IMAGE_DEST'),
          filename: fileName
        }),
        limits: {
          fileSize: parseInt(configService.get('IMGSIZE_LIMIT')),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ArtService],
  controllers: [ArtController],
})
export class ArtModule {}
