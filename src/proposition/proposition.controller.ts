/* eslint-disable */
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Body,
  Req,
  UploadedFiles,
  HttpStatus,
  HttpCode,
  UseFilters,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import CreateArtBadRequestFilter from 'src/utils/file_upload/exception-filters/delete-file.ef.ts';
import { CreatePropositionDto } from './dto/create-proposition.dto';
import { PropositionService } from './proposition.service';
//import { UpdatePropositionDto } from './dto/update-proposition.dto';

@Controller('proposition')
export class PropositionController {
  constructor(private readonly propositionService: PropositionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseFilters(CreateArtBadRequestFilter)
  @UseInterceptors(FilesInterceptor('files', 3))
  @JwtAuth(Role.USER)
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createPropositionDto: CreatePropositionDto,
    @Req() request: any /*@Body() createPropositionDto: CreatePropositionDto*/,
  ) {
    console.log(files);
    if (files && files.length >= 1) {
      const filenames = files.map((f) => f.filename);
      await this.propositionService.create(
        createPropositionDto,
        request.user.id,
        filenames,
      );
    } else {
      throw new HttpException(
        'At least one picture must be provided!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Art suggestion successfully created!',
    };
  }

  @Get()
  findAll() {
    return this.propositionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propositionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id')
    id: string /*@Body() updatePropositionDto: UpdatePropositionDto*/,
  ) {
    return this.propositionService.update(+id /*updatePropositionDto*/);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propositionService.remove(+id);
  }
}
