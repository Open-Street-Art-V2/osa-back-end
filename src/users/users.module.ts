import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Trophie } from 'src/trophie/entities/trophie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository, Trophie])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
