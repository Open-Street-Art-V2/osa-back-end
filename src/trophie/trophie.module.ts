import { Module } from '@nestjs/common';
import { TrophieService } from './trophie.service';
import { TrophieController } from './trophie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Trophie } from './entities/trophie.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Trophie]), UsersModule],
  controllers: [TrophieController],
  providers: [TrophieService],
})
export class TrophieModule {}
