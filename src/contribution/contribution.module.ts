import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { ArtRepository } from 'src/art/art.repository';
import { Picture } from 'src/art/picture/picture.entity';
import { PictureService } from 'src/art/picture/picture.service';
import { PropPicture } from 'src/proposition/proposition-picture/proposition-picture.entity';
import { PropPictureService } from 'src/proposition/proposition-picture/proposition-picture.service';
import { UsersRepository } from 'src/users/user.repository';
import fileName from 'src/utils/file_upload/filename';
import { imageFilter } from 'src/utils/file_upload/filter';
import { ContributionService } from './contribution.service';
import { ContrubController } from './contrub.controller';
import { contrubArt } from './contrub.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      contrubArt,
      UsersRepository,
      ArtRepository,
      PropPicture,
      Picture,
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        fileFilter: imageFilter,
        storage: diskStorage({
          destination: configService.get('IMAGE_DEST'),
          filename: fileName,
        }),
        limits: {
          fileSize: parseInt(configService.get('IMGSIZE_LIMIT')),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ContributionService, PropPictureService, PictureService],
  controllers: [ContrubController],
})
export class ContributionModule {}
