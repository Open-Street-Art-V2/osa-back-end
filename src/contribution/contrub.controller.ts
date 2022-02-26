import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import CreateArtBadRequestFilter from 'src/utils/file_upload/exception-filters/delete-file.ef.ts';
import { ContributionService } from './contribution.service';
import { ContributionDto } from './dto/contribution.dto';

@Controller('contrub')
export class ContrubController {
  constructor(private readonly contributionService: ContributionService) {}

  @Patch(':id')
  @UseFilters(CreateArtBadRequestFilter)
  @UseInterceptors(FilesInterceptor('files', 3))
  @JwtAuth(Role.USER)
  async create(
    @Param('id') id: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() contributionDto: ContributionDto,
    @Req() request: any /*@Body() createPropositionDto: CreatePropositionDto*/,
  ) {
    if (files && files.length >= 1) {
      const filenames: string[] = files.map((f) => f.filename);
      await this.contributionService.contribution(
        contributionDto,
        request.user.id,
        id,
        filenames,
      );
    }
    await this.contributionService.contribution(
      contributionDto,
      request.user.id,
      id,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Art suggestion successfully created!',
    };
  }

  @Get()
  //@JwtAuth(Role.USER)
  async findAll() {
    return this.contributionService.findAll();
  }

  @Post(':id')
  @JwtAuth(Role.USER)
  validate(@Param('id') id: string) {
    return this.contributionService.validateContribution(+id);
  }
}
