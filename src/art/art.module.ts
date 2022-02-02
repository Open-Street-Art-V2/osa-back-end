import { Module } from '@nestjs/common';
import { ArtService } from './art.service';
import { ArtController } from './art.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtRepository } from './art.repository';
import { PictureModule } from './pictures/picture.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArtRepository]), PictureModule],
  providers: [ArtService],
  controllers: [ArtController],
})
export class ArtModule {}
