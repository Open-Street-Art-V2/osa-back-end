import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Art } from 'src/art/art.entity';
import { User } from 'src/users/user.entity';
import { ArtRepository } from 'src/art/art.repository';
import { UsersRepository } from 'src/users/user.repository';
import { Repository } from 'typeorm';
import { FavoriteArt } from './entities/favorite-art.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
//import { FavoriteArtist } from './entities/favorite-artist.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteArt)
    private favoriteArtRepo: Repository<FavoriteArt>,
    // @InjectRepository(FavoriteArtist)
    // private favoriteArtistRepo: Repository<FavoriteArtist>,
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    @InjectRepository(ArtRepository) private artRepository: ArtRepository,
  ) {}
  async addFavoriteArt(artId: number, userId: number) {
    let loggedInUser: User;
    let art: Art;
    try {
      loggedInUser = await this.usersRepository.findOne({
        where: { id: userId },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('Wrong user', HttpStatus.NOT_FOUND);
    }
    console.log(loggedInUser);
    try {
      art = await this.artRepository.findOne(artId);
    } catch (err) {
      throw new HttpException(
        `Art with id: ${artId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      const favoriteArt: FavoriteArt = new FavoriteArt();
      favoriteArt.art = art;
      favoriteArt.user = loggedInUser;

      await this.favoriteArtRepo.insert(favoriteArt);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Art already in favorites',
          HttpStatus.CONFLICT,
        );
      }
      console.log(err);
      throw new HttpException(
        'Something went wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return 'Art successfully added to favorites';
  }

  async findAllArts(options: IPaginationOptions, userId: number) {
    options.limit =
      options.limit > 20 || options.limit <= 0 ? 20 : options.limit;
    options.page = options.page <= 0 ? 1 : options.page;
    const result = await this.favoriteArtRepo.find({
      where: { user: userId },
      skip: (+options.page - 1) * +options.limit,
      take: +options.limit,
    });
    return result.map((item) => {
      return { createdAt: item.created_at, art: item.art };
    });
  }

  async remove(id: number, userId: number) {
    let favoriteArt: FavoriteArt;
    try {
      favoriteArt = await this.favoriteArtRepo.findOne({ where: { art: id } });
    } catch (err) {
      console.log(err);
      throw new HttpException('Art was not found', HttpStatus.NOT_FOUND);
    }
    if (!favoriteArt) {
      throw new HttpException('Art was not found', HttpStatus.NOT_FOUND);
    }
    console.log(favoriteArt);
    if (favoriteArt.user.id !== userId) {
      throw new HttpException('Art was not found', HttpStatus.UNAUTHORIZED);
    }
    try {
      await this.favoriteArtRepo.remove(favoriteArt);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Failed to remove art from favorites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      message: 'Favorite art removed successfully',
      statusCode: 200,
    };
  }

  async addFavoriteArtist(artId: number, userId: number) {
    console.log(artId + '' + userId);
    return 'This action adds a new favorite';
  }
}
