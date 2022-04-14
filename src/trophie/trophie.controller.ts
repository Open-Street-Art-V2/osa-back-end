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
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { UsersService } from 'src/users/users.service';
import { PaginationDto } from 'src/proposition/dto/pagination.dto';

@Controller('trophie')
export class TrophieController {
  constructor(
    private readonly trophieService: TrophieService,
    private readonly userService: UsersService,
  ) {}

  @Get('paginate/:user-id')
  @JwtAuth(Role.ADMIN, Role.USER)
  async getTrophiesPaginate(
    @Query() paginationDto: PaginationDto,
    @Param() userId,
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

  @Get(':user-id')
  @JwtAuth(Role.ADMIN, Role.USER)
  async getTrophies(@Param() userId) {
    const user = await this.userService.findOne(userId);
    return user.trophies;
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
