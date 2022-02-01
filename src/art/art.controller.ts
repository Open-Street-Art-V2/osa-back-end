import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles/decorator/roles.decorator';
import { RoleGuard } from 'src/auth/roles/guards/role.guard';
import { Role } from 'src/auth/roles/role.enum';
import { DeleteResult } from 'typeorm';
import { Art } from './art.entity';
import { ArtService } from './art.service';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { GetArtsQuery } from './types/query-params.type';

@Controller('art')
@ApiTags('Art')
export class ArtController {
  constructor(private readonly artService: ArtService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async create(@Body() createArtDto: CreateArtDto) {
    const art: Art = await this.artService.createArt(createArtDto);
    return {
      statusCode: 201,
      art: art,
    };
  }

  @Get()
  @ApiQuery({
    description: 'Art title',
    name: 'title',
    type: 'string',
    required: false,
  })
  public async getArts(@Query() queryParams: GetArtsQuery) {
    if (Object.keys(queryParams).length === 0) {
      // if no params in the query
      const art: Art[] = await this.artService.getArts();
      return art;
    }

    if (queryParams.title) {
      const art: Art = await this.artService.getArtByTitle(queryParams.title);
      return art;
    } else if (queryParams.artist) {
      const art = await this.artService.getArtByArtist(queryParams.artist);
      return {
        statusCode: 200,
        count: art[1],
        art: art[0],
      };
    }
  }

  @Get(':artId')
  @ApiParam({ description: 'Art ID', name: 'artId', type: 'number' })
  public async getArt(@Param('artId') artId: number) {
    const art: Art = await this.artService.getArt(artId);
    return {
      statusCode: 200,
      art: art,
    };
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Patch(':artId')
  @ApiParam({ description: 'Art ID', name: 'artId', type: 'number' })
  @ApiBody({
    description: 'Fields to edit',
    type: CreateArtDto,
    required: true,
  })
  public async update(
    @Param('artId') artId: number,
    @Body() updateArtDto: UpdateArtDto,
  ) {
    const art: Art = await this.artService.editArt(artId, updateArtDto);
    return {
      statusCode: 200,
      art: art,
    };
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Delete('/:artId')
  public async remove(@Param('artId') artId: number) {
    const art: DeleteResult = await this.artService.deleteArt(artId);
    return {
      statusCode: 200,
      deleted: {
        id: artId,
        affected: art.affected,
      },
    };
  }
}
