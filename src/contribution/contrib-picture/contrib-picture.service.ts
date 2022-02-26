import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { ContribPicture } from './contrib-picture.entity';
import { contrubArt } from '../contrub.entity';

@Injectable()
export class ContribPictureService {
  constructor(
    @InjectRepository(ContribPicture)
    private pictureRepository: Repository<ContribPicture>,
  ) {}

  public async createPictures(proposition: contrubArt, filenames: string[]) {
    const pictures: ContribPicture[] = [];
    filenames.forEach(async (item, index) => {
      const picture: ContribPicture = {
        position: index + 1,
        url: item,
        contribution: proposition,
      };
      const res = await this.pictureRepository.save(picture);
      pictures.push(res);
    });

    return pictures;
  }

  public async editPictures(
    filenames: string[],
    tabIndex: number[],
    proposition: contrubArt,
  ) {
    const pictures: ContribPicture[] = [];
    filenames.forEach(async (item, index) => {
      const picture: ContribPicture = {
        position: tabIndex[index],
        url: item,
        contribution: proposition,
      };
      const res = await this.pictureRepository.save(picture);
      pictures.push(res);
    });

    return pictures;
  }
  public removePicturesFromFileSystem(filenames: string[]) {
    // remove pictures from the file system
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    try {
      filenames.map((filename) => {
        const path = `${process.env.IMAGE_DEST}/${filename}`;
        fs.unlink(path, (err) => {
          //TODO: Handle error????
          if (err) console.log('image cannot be deleted');
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
