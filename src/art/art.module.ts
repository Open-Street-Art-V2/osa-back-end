import { Module } from '@nestjs/common';
import { ArtService } from './art.service';
import { ArtController } from './art.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtRepository } from './art.repository';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [TypeOrmModule.forFeature([ArtRepository])],
  providers: [ArtService],
  controllers: [ArtController],
})
export class ArtModule {}
