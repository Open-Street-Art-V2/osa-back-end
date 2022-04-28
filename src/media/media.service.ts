/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Art } from 'src/art/art.entity';
import { ArtRepository } from 'src/art/art.repository';
import { Like } from 'typeorm';
import { join } from 'path';

const pdf = require('pdf-creator-node');
const fs = require('fs');

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  constructor(
    @InjectRepository(ArtRepository) private artRepository: ArtRepository,
  ) {}

  public async getArtByCity(city: string): Promise<Art[]> {
    return await this.artRepository.find({
      where: { city: Like(`${city}%`) },
    });
  }

  public async createPDF(arts: Art[], city: string): Promise<StreamableFile> {
    // const artsToDisplay = arts.map((art: any) => {
    //   const picture =
    //     'file://' + process.env.IMAGE_DEST + '/' + art.pictures[0].url;
    //   console.log(picture);
    //   return (art = {
    //     ...art,
    //     picture,
    //   });
    // });

    const logo = 'file://' + process.cwd() + '/src/media/template/logo.png';

    const html = fs.readFileSync(
      join(process.cwd(), '/src/media/template/pdf.template.html'),
      'utf8',
    );

    const document = {
      html: html,
      data: {
        logo,
        city,
        arts,
      },
      path: '',
      type: 'buffer',
    };

    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm',
      localUrlAccess: true,
    };

    return pdf.create(document, options).then((res) => {
      this.logger.log(`PDF created for city : ${city}`);
      return new StreamableFile(res);
    });
  }
}
