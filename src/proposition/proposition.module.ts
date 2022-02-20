import { Module } from '@nestjs/common';
import { PropositionService } from './proposition.service';
import { PropositionController } from './proposition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposition } from './entities/proposition.entity';
import { ArtRepository } from 'src/art/art.repository';
import { UsersRepository } from 'src/users/user.repository';
import { PropPicture } from './proposition-picture/proposition-picture.entity';
import { PropPictureService } from './proposition-picture/proposition-picture.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import fileName from 'src/utils/file_upload/filename';
import { imageFilter } from 'src/utils/file_upload/filter';
import { Picture } from 'src/art/picture/picture.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proposition,
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
  controllers: [PropositionController],
  providers: [PropositionService, PropPictureService],
})
export class PropositionModule {}
