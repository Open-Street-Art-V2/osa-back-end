import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  UseFilters,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { exceptionUploadFiles } from 'src/utils/file.utils';
import CreateArtBadRequestFilter from 'src/utils/file_upload/exception-filters/delete-file.ef.ts';
import { DeleteResult } from 'typeorm';
import { Art } from './art.entity';
import { ArtService } from './art.service';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { GetArtsQuery } from './types/query-params.type';

@Controller('art')
@ApiTags('Art')
export class ArtController {
  constructor(
    private readonly artService: ArtService, //private readonly pictureService: PictureService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseFilters(CreateArtBadRequestFilter)
  @UseInterceptors(FilesInterceptor('files', 3))
  @JwtAuth(Role.ADMIN)
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createArtDto: CreateArtDto,
    @Req() request: any,
  ) {
    if (files && files.length >= 1) {
      const filenames = files.map((f) => f.filename);
      const art: Art = await this.artService.createArt(
        createArtDto,
        request.user.id,
        filenames,
      );
      return {
        statusCode: HttpStatus.CREATED,
        art: art,
      };
    } else {
      throw new HttpException(
        'At least one picture must be provided!',
        HttpStatus.BAD_REQUEST,
      );
    }
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

  @JwtAuth(Role.ADMIN)
  @Patch(':artId')
  @UseFilters(CreateArtBadRequestFilter)
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiParam({ description: 'Art ID', name: 'artId', type: 'number' })
  @ApiBody({
    description: 'Fields to edit',
    type: UpdateArtDto,
    required: true,
  })
  public async update(
    @Param('artId') artId: number,
    @Body() updateArtDto: UpdateArtDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (files && files.length >= 1) {
      const filenames = files.map((f) => f.filename);
      // Check if numbers of files matches index
      exceptionUploadFiles(filenames, updateArtDto.index);
      await this.artService.editArt(artId, updateArtDto, filenames);
    } else {
      await this.artService.editArt(artId, updateArtDto);
    }
    return {
      statusCode: 200,
      message: `Proposition with id:${artId} updated successfully`,
    };
  }

  @JwtAuth(Role.ADMIN)
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

  /*@HttpCode(HttpStatus.CREATED)
  @Post(':artId/pictures')
  @UseInterceptors(FilesInterceptor('files', 3))
  public async uploadPictures(
    @Param('artId') artId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const filenames = files.map((f) => f.filename);
    const getArt=this.artService.getArt(artId);
    const pictures = await this.pictureService.createPictures(artId, filenames);

    return {
      statusCode: 201,
      pictures: pictures,
    };
  }*/
}
