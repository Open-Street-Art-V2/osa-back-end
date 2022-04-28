import { Controller, Get, Header, Param, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Art } from 'src/art/art.entity';
import { MediaService } from './media.service';

@Controller('media')
@ApiTags('Media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('pdf/:city')
  @Header('Content-type', 'application/pdf')
  async getPDF(@Param('city') city: string): Promise<StreamableFile> {
    const arts: Art[] = await this.mediaService.getArtByCity(city);
    return this.mediaService.createPDF(arts, city);
  }
}
