import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  Query,
} from '@nestjs/common';
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { PaginationDto } from 'src/proposition/dto/pagination.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @JwtAuth(Role.USER, Role.ADMIN)
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
  @JwtAuth(Role.USER, Role.ADMIN)
  async findArts(@Query() paginationDTO: PaginationDto, @Req() req) {
    if (Object.keys(paginationDTO).length === 2) {
      return await this.favoritesService.findAllArts(
        {
          limit: paginationDTO.limit,
          page: paginationDTO.page,
        },
        req.user.id,
      );
    } else {
      return await this.favoritesService.findAllArts(
        {
          limit: 10,
          page: 1,
        },
        req.user.id,
      );
    }
  }

  @JwtAuth(Role.USER, Role.ADMIN)
  @Delete('art/:id')
  async removeArt(@Param('id', ParseIntPipe) id: number, @Req() req) {
    console.log(req.user);
    return await this.favoritesService.remove(+id, req.user.id);
  }

  @Post('artist')
  createArtist(@Param('id', ParseIntPipe) id: number, @Req() request) {
    return this.favoritesService.addFavoriteArtist(id, request.user.id);
  }

  @Get('artist')
  findArtists() {
    return;
  }

  @Delete('artist/:id')
  removeArtist(@Param('id', ParseIntPipe) id: number) {
    return;
  }
}
