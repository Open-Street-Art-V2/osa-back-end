import { MediaController } from './media.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArtRepository } from 'src/art/art.repository';
import { MediaService } from './media.service';
@Module({
  imports: [TypeOrmModule.forFeature([ArtRepository])],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
