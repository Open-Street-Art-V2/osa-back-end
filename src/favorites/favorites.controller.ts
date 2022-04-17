import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  Query,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { FavoriteDto } from './dto/get-favorite.dto';
import { removeFavoriteDTO } from './dto/remove-favorite.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@ApiTags('Favorite')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @JwtAuth(Role.ADMIN, Role.USER)
  @Post('art/:id')
  async createArt(@Param('id', ParseIntPipe) id: number, @Req() request) {
    const message = await this.favoritesService.addFavoriteArt(
      id,
      request.user.id,
    );
    return {
      statusCode: 200,
      message,
    };
  }

  @Get('art')
  async findArts(@Query() favoriteDTO: FavoriteDto) {
    if (
      Object.keys(favoriteDTO).length === 3 ||
      Object.keys(favoriteDTO).length === 2
    ) {
      return await this.favoritesService.findAllArts(
        {
          limit: favoriteDTO.limit,
          page: favoriteDTO.page,
        },
        favoriteDTO.id,
      );
    } else {
      return await this.favoritesService.findAllArts(
        {
          limit: 10,
          page: 1,
        },
        favoriteDTO.id,
      );
    }
  }

  @JwtAuth(Role.ADMIN, Role.USER)
  @Get('art/:id')
  async favoriteArtExist(@Param('id', ParseIntPipe) id: number, @Req() req) {
    if (id) {
      return await this.favoritesService.favoriteArtExist(id, req.user.id);
    } else {
      throw new HttpException(
        'You must provide and "id" parameter',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @JwtAuth(Role.ADMIN, Role.USER)
  @Delete('art')
  async multiRemoveArt(@Body() ids: removeFavoriteDTO, @Req() req) {
    return await this.favoritesService.multiRemoveArt(ids.ids, req.user.id);
  }

  @JwtAuth(Role.ADMIN, Role.USER)
  @Delete('art/:id')
  async removeArt(@Param('id', ParseIntPipe) id: number, @Req() req) {
    console.log(req.user);
    return await this.favoritesService.removeArt(+id, req.user.id);
  }

  @JwtAuth(Role.ADMIN, Role.USER)
  @Post('artist/:id')
  async reateArtist(@Param('id', ParseIntPipe) id: number, @Req() request) {
    return await this.favoritesService.addFavoriteArtist(id, request.user.id);
  }

  @Get('artist')
  async findArtists(@Query() favoriteDTO: FavoriteDto) {
    if (
      Object.keys(favoriteDTO).length === 3 ||
      Object.keys(favoriteDTO).length === 2
    ) {
      return await this.favoritesService.findAllArtists(
        {
          limit: favoriteDTO.limit,
          page: favoriteDTO.page,
        },
        favoriteDTO.id,
      );
    } else {
      return await this.favoritesService.findAllArtists(
        {
          limit: 10,
          page: 1,
        },
        favoriteDTO.id,
      );
    }
  }

  @JwtAuth(Role.ADMIN, Role.USER)
  @Get('artist/:id')
  async favoriteArtistExist(@Param('id', ParseIntPipe) id: number, @Req() req) {
    if (id) {
      return await this.favoritesService.favoriteArtistExist(id, req.user.id);
    } else {
      throw new HttpException(
        'You must provide and "id" parameter',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @JwtAuth(Role.ADMIN, Role.USER)
  @Delete('artist')
  async multiRemoveArtist(@Body() ids: removeFavoriteDTO, @Req() req) {
    return await this.favoritesService.multiRemoveArtist(ids.ids, req.user.id);
  }

  @JwtAuth(Role.ADMIN, Role.USER)
  @Delete('artist/:id')
  async removeArtist(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return await this.favoritesService.removeArtist(id, req.user.id);
  }
}
