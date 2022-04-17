import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteArt } from './entities/favorite-art.entity';
import { FavoriteArtist } from './entities/favorite-artist.entity';
import { UsersRepository } from 'src/users/user.repository';
import { ArtRepository } from 'src/art/art.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FavoriteArt,
      FavoriteArtist,
      UsersRepository,
      ArtRepository,
    ]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
