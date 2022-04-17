import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TrophieService } from './trophie.service';
import { CreateTrophieDto } from './dto/create-trophie.dto';
import { UpdateTrophieDto } from './dto/update-trophie.dto';
// import { UsersService } from 'src/users/users.service';
import { PaginationDto } from 'src/proposition/dto/pagination.dto';

@Controller('trophie')
export class TrophieController {
  constructor(
    private readonly trophieService: TrophieService, // private readonly userService: UsersService,
  ) {}

  @Get('paginate/:id')
  async getTrophiesPaginate(
    @Query() paginationDto: PaginationDto,
    @Param('id') userId,
  ) {
    if (Object.keys(paginationDto).length === 2) {
      return this.trophieService.findAllTrophies(
        {
          limit: paginationDto.limit,
          page: paginationDto.page,
        },
        userId,
      );
    } else {
      return this.trophieService.findAllTrophies(
        {
          limit: 10,
          page: 1,
        },
        userId,
      );
    }
  }

  // @Get(':id')
  // @JwtAuth(Role.ADMIN, Role.USER)
  // async getTrophies(@Param('id') userId) {
  //   const user = await this.userService.findOne(userId);
  //   return user.trophies;
  // }

  @Get('test')
  test(@Query('user-id') userId, @Query('trophie-name') trophieName) {
    return this.trophieService.insertTrophieToUser(userId, trophieName);
  }

  @Post()
  create(@Body() createTrophieDto: CreateTrophieDto) {
    return this.trophieService.create(createTrophieDto);
  }

  @Get()
  findAll() {
    return this.trophieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trophieService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrophieDto: UpdateTrophieDto) {
    return this.trophieService.update(+id, updateTrophieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trophieService.remove(+id);
  }
}
