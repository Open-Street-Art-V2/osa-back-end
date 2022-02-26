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
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody } from '@nestjs/swagger';
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { exceptionUploadFiles } from 'src/utils/file.utils';
import CreateArtBadRequestFilter from 'src/utils/file_upload/exception-filters/delete-file.ef.ts';
import { CreatePropositionDto } from './dto/create-proposition.dto';
import { UpdatePropositionDto } from './dto/update-proposition.dto';
import { ValidatePropDto } from './dto/validate-proposition.dto';
import { PropositionService } from './proposition.service';

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
  //@JwtAuth(Role.USER)
  async findAll() {
    return this.propositionService.findAll();
  }

  @Get(':id')
  @JwtAuth(Role.USER)
  findOne(@Param('id') id: string) {
    return this.propositionService.findOne(+id);
  }

  @Patch(':id')
  @JwtAuth(Role.USER)
  @UseFilters(CreateArtBadRequestFilter)
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiBody({
    description: 'Fields to edit',
    type: UpdatePropositionDto,
    required: true,
  })
  async update(
    @Param('id', ParseIntPipe)
    propId: number,
    @Body() updatePropositionDto: UpdatePropositionDto,
    @Req() request: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (files && files.length >= 1) {
      const filenames = files.map((f) => f.filename);
      // Check if numbers of files matches index
      exceptionUploadFiles(filenames, updatePropositionDto.index);
      await this.propositionService.update(
        +propId,
        request.user.id,
        updatePropositionDto,
        filenames,
      );
    } else {
      await this.propositionService.update(
        propId,
        request.user.id,
        updatePropositionDto,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      message: `Proposition with id:${propId} updated successfully`,
    };
  }

  @Delete(':id')
  @JwtAuth(Role.ADMIN, Role.USER)
  async remove(@Param('id') id: string, @Req() request: any) {
    return await this.propositionService.remove(+id, request.user);
  }

  @Post('validate')
  @JwtAuth(Role.ADMIN)
  async validate(@Body() validatePropDto: ValidatePropDto) {
    return this.propositionService.validate(validatePropDto.propositions);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(':id')
  @UseFilters(CreateArtBadRequestFilter)
  @UseInterceptors(FilesInterceptor('files', 3))
  @JwtAuth(Role.USER)
  async contribution(
    @Param('id') id: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createPropositionDto: CreatePropositionDto,
    @Req() request: any /*@Body() createPropositionDto: CreatePropositionDto*/,
  ) {
    if (files && files.length >= 1) {
      const filenames = files.map((f) => f.filename);
      exceptionUploadFiles(filenames, createPropositionDto.index);
      await this.propositionService.contribution(
        createPropositionDto,
        request.user.id,
        id,
        filenames,
      );
    } else {
      await this.propositionService.contribution(
        createPropositionDto,
        request.user.id,
        id,
      );
    }
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Art suggestion successfully created!',
    };
  }

  @Post('contrub/:id')
  //@JwtAuth(Role.ADMIN)
  async validateContribution(@Param('id') id: number) {
    return this.propositionService.validateContribution(id);
  }
}
