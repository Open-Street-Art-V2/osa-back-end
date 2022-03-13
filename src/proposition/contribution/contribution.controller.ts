import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { exceptionUploadFiles } from 'src/utils/file.utils';
import CreateArtBadRequestFilter from 'src/utils/file_upload/exception-filters/delete-file.ef.ts';
import { CreatePropositionDto } from '../dto/create-proposition.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { ValidatePropDto } from '../dto/validate-proposition.dto';
import { ContributionService } from './contribution.service';

@Controller('contribution')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @Get()
  @JwtAuth(Role.ADMIN)
  async getContribution(@Query() paginationDto: PaginationDto) {
    if (Object.keys(paginationDto).length === 2) {
      return this.contributionService.findAllContribution({
        limit: paginationDto.limit,
        page: paginationDto.page,
      });
    } else {
      return this.contributionService.findAllContribution({
        limit: 10,
        page: 1,
      });
    }
  }

  // Get proposition by Id
  @Get(':id')
  @JwtAuth(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contributionService.findOne(+id);
  }

  // Add new Contribution

  @HttpCode(HttpStatus.CREATED)
  @Post('add/:id')
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
      await this.contributionService.contribution(
        createPropositionDto,
        request.user.id,
        id,
        filenames,
      );
    } else {
      await this.contributionService.contribution(
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
  // Validate one contribution
  @Post('validOne/:id')
  @JwtAuth(Role.ADMIN)
  async validateContribution(@Param('id') id: number) {
    return this.contributionService.validateContribution([id]);
  }

  // Validate a lot of contribution the same time

  @Post('validMany')
  @JwtAuth(Role.ADMIN)
  async validate(@Body() validatePropDto: ValidatePropDto) {
    return this.contributionService.validateContribution(
      validatePropDto.propositions,
    );
  }

  //Delete contribution

  @Delete(':id')
  @JwtAuth(Role.ADMIN)
  async remove(@Param('id') id: string, @Req() request: any) {
    return await this.contributionService.remove(+id, request.user);
  }

  // remove a lot of contribution the same time

  @Delete()
  @JwtAuth(Role.ADMIN)
  async deleteMany(
    @Body() validatePropDto: ValidatePropDto,
    @Req() request: any,
  ) {
    console.log(validatePropDto);
    return this.contributionService.deleteManyContribution(
      validatePropDto.propositions,
      request.user,
    );
  }
}
