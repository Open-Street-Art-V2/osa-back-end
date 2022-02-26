import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Art } from '../art.entity';
import { Picture } from './picture.entity';

@Injectable()
export class PictureService {
  constructor(
    @InjectRepository(Picture) private pictureRepository: Repository<Picture>,
  ) {}

  public async createPictures(art: Art, filenames: string[]) {
    const pictures: Picture[] = [];
    filenames.forEach(async (item, index) => {
      const picture: Picture = {
        position: index + 1,
        url: item,
        art: art,
      };
      const res = await this.pictureRepository.save(picture);
      pictures.push(res);
    });

    return pictures;
  }

  public async editPictures(filenames: string[], tabIndex: number[], art: Art) {
    const pictures: Picture[] = [];
    filenames.forEach(async (item, index) => {
      const picture: Picture = {
        position: tabIndex[index],
        url: item,
        art: art,
      };
      const res = await this.pictureRepository.save(picture);
      pictures.push(res);
    });

    return pictures;
  }
  public removePicturesFromFileSystem(filenames: string[]) {
    // remove pictures from the file system
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    try {
      filenames.map((filename) => {
        const path = `${process.env.IMAGE_DEST}/${filename}`;
        fs.unlink(path, (err) => {
          if (err) throw err;
          else console.log(`Deleted image : ${filename}`);
        });
      });
    } catch (err) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
