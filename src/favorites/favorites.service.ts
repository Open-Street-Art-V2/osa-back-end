import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Art } from 'src/art/art.entity';
import { User } from 'src/users/user.entity';
import { ArtRepository } from 'src/art/art.repository';
import { UsersRepository } from 'src/users/user.repository';
import { In, Repository } from 'typeorm';
import { FavoriteArt } from './entities/favorite-art.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { FavoriteArtist } from './entities/favorite-artist.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteArt)
    private favoriteArtRepo: Repository<FavoriteArt>,
    @InjectRepository(FavoriteArtist)
    private favoriteArtistRepo: Repository<FavoriteArtist>,
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    @InjectRepository(ArtRepository) private artRepository: ArtRepository,
  ) {}
  async addFavoriteArt(artId: number, userId: number) {
    let loggedInUser: User;
    let art: Art;
    try {
      art = await this.artRepository.findOne(artId);
    } catch (err) {
      throw new HttpException(
        `Art with id: ${artId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!art)
      throw new HttpException(
        'Art was not found or you own the art',
        HttpStatus.FORBIDDEN,
      );
    try {
      loggedInUser = await this.usersRepository.findOne({
        where: { id: userId },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('Wrong user', HttpStatus.NOT_FOUND);
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

  async favoriteArtExist(id: number, userId: number) {
    try {
      const result = await this.favoriteArtRepo.findOne({
        where: { art: id, user: userId },
      });
      if (result) return { statusCode: 200, exist: true };
      return { statusCode: 200, exist: false };
    } catch (err) {
      throw new HttpException(
        'Something went wrong when looking for art',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeArt(id: number, userId: number) {
    let favoriteArt: FavoriteArt;
    try {
      favoriteArt = await this.favoriteArtRepo.findOne({
        where: { art: id, user: userId },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('Art was not found', HttpStatus.NOT_FOUND);
    }
    if (!favoriteArt) {
      throw new HttpException('Art was not found', HttpStatus.NOT_FOUND);
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

  async multiRemoveArt(ids: number[], userId: number) {
    let favoriteArt: FavoriteArt[];
    try {
      favoriteArt = await this.favoriteArtRepo.find({
        where: { art: In(ids), user: userId },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('Arts were not found', HttpStatus.NOT_FOUND);
    }
    if (favoriteArt.length <= 0) {
      throw new HttpException('No arts were found', HttpStatus.NOT_FOUND);
    }

    try {
      await this.favoriteArtRepo.remove(favoriteArt);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Failed to remove arts from favorites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      message: 'Favorite arts removed successfully',
      statusCode: 200,
    };
  }

  async addFavoriteArtist(artistId: number, userId: number) {
    if (userId === artistId)
      throw new HttpException(
        'Cannot add yourself to favorites',
        HttpStatus.FORBIDDEN,
      );
    let user: User;
    let me: User;
    try {
      user = await this.usersRepository.findOne(artistId);
      me = await this.usersRepository.findOne(userId);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!me || !user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    try {
      const favoriteArtist = { user: me, artist: user };
      await this.favoriteArtistRepo.insert(favoriteArtist);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'User already in favorites',
          HttpStatus.CONFLICT,
        );
      }
      console.log(err);
      throw new HttpException(
        'Something went wrong when adding favorite',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      statusCode: 200,
      message: 'User successfully added to favorites list',
    };
  }

  async removeArtist(artistId: number, userId: number) {
    let favoriteArtist: FavoriteArtist;
    try {
      favoriteArtist = await this.favoriteArtistRepo.findOne({
        where: { user: userId, artist: artistId },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Something went wrong when looking for favorite',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!favoriteArtist) {
      throw new HttpException('Favorite was not found', HttpStatus.NOT_FOUND);
    }

    try {
      await this.favoriteArtistRepo.remove(favoriteArtist);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Failed to remove artist from favorites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      message: 'Favorite artist removed successfully',
      statusCode: 200,
    };
  }

  async multiRemoveArtist(artistId: number[], userId: number) {
    let favoriteArtist: FavoriteArtist[];
    try {
      favoriteArtist = await this.favoriteArtistRepo.find({
        where: {
          user: userId,
          artist: In(artistId),
        },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Something went wrong when looking for favorites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!favoriteArtist.length) {
      throw new HttpException(
        'Given favorites were not found',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.favoriteArtistRepo.remove(favoriteArtist);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Failed to remove artist from favorites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      message: 'Favorite artist removed successfully',
      statusCode: 200,
    };
  }

  async findAllArtists(options: IPaginationOptions, userId: number) {
    options.limit =
      options.limit > 20 || options.limit <= 0 ? 20 : options.limit;
    options.page = options.page <= 0 ? 1 : options.page;
    const result = await this.favoriteArtistRepo.find({
      where: { user: userId },
      skip: (+options.page - 1) * +options.limit,
      take: +options.limit,
    });
    return result.map((item) => {
      return {
        createdAt: item.created_at,
        artist: {
          id: item.artist.id,
          name: item.artist.name,
          firstname: item.artist.firstname,
          favoriteCity: item.artist.favoriteCity,
          role: item.artist.role,
        },
      };
    });
  }

  async favoriteArtistExist(id: number, userId: number) {
    try {
      const result = await this.favoriteArtistRepo.findOne({
        where: { artist: id, user: userId },
      });
      if (result) return { statusCode: 200, exist: true };
      return { statusCode: 200, exist: false };
    } catch (err) {
      throw new HttpException(
        'Something went wrong when looking for user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
