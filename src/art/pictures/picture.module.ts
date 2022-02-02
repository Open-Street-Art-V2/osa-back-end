import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Picture } from './picture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Picture])],
})
export class PictureModule {}
