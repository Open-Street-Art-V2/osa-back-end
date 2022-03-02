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
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody } from '@nestjs/swagger';
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { exceptionUploadFiles } from 'src/utils/file.utils';
import CreateArtBadRequestFilter from 'src/utils/file_upload/exception-filters/delete-file.ef.ts';
import { CreatePropositionDto } from './dto/create-proposition.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdatePropositionDto } from './dto/update-proposition.dto';
import { ValidatePropDto } from './dto/validate-proposition.dto';
import { PropositionService } from './proposition.service';

@Controller('proposition')
export class PropositionController {
  constructor(private readonly propositionService: PropositionService) {}

  //Create proposition

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

  // Get all propostion
  @Get()
  @JwtAuth(Role.ADMIN)
  async paginate(@Query() paginationDto: PaginationDto) {
    if (Object.keys(paginationDto).length === 2) {
      return this.propositionService.paginate({
        limit: paginationDto.limit,
        page: paginationDto.page,
      });
    } else {
      return this.propositionService.paginate({
        limit: 10,
        page: 1,
      });
    }
  }

  // Get one proposition
  @Get(':id')
  @JwtAuth(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.propositionService.findOne(+id);
  }

  @Get('/mine/all')
  @JwtAuth(Role.USER)
  async findUserPropositions(
    @Query() paginationDto: PaginationDto,
    @Req() req,
  ) {
    if (Object.keys(paginationDto).length === 2) {
      return this.propositionService.findUserPropositions(
        {
          limit: paginationDto.limit,
          page: paginationDto.page,
        },
        req.user.id,
      );
    } else {
      return this.propositionService.findUserPropositions(
        {
          limit: 10,
          page: 1,
        },
        req.user.id,
      );
    }
  }

  @Get('user/:id')
  @JwtAuth(Role.USER)
  findUserProposition(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.propositionService.findUserProposition(+id, req.user.id);
  }

  // update proposition
  @Patch('user/:id')
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

  @Delete()
  @JwtAuth(Role.ADMIN, Role.USER)
  async removeBatch(@Body() validatePropDto: ValidatePropDto, @Req() request) {
    return await this.propositionService.removeBatch(
      validatePropDto.propositions,
      request.user.id,
    );
  }

  // Validate multile proposition

  @Post('validate')
  @JwtAuth(Role.ADMIN)
  async validate(@Body() validatePropDto: ValidatePropDto) {
    return this.propositionService.validate(validatePropDto.propositions);
  }
}
