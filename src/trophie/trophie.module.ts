import { Module } from '@nestjs/common';
import { TrophieService } from './trophie.service';
import { TrophieController } from './trophie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TrophieController],
  providers: [TrophieService],
})
export class TrophieModule {}
