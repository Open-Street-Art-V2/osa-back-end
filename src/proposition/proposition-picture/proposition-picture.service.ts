import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposition } from '../entities/proposition.entity';
import { PropPicture } from './proposition-picture.entity';
import * as fs from 'fs';

@Injectable()
export class PropPictureService {
  constructor(
    @InjectRepository(PropPicture)
    private pictureRepository: Repository<PropPicture>,
  ) {}

  public async contributionPictures(
    proposition: Proposition,
    filenames: string[],
    index: number,
  ) {
    const pictures: PropPicture[] = [];

    switch (index) {
      case 1: {
        const picture: PropPicture = {
          position: 1,
          url: filenames[0],
          proposition: proposition,
        };
        const res = await this.pictureRepository.save(picture);
        pictures.push(res);
        break;
      }
      case 2: {
        const picture: PropPicture = {
          position: 2,
          url: filenames[0],
          proposition: proposition,
        };
        const res = await this.pictureRepository.save(picture);
        pictures.push(res);
        break;
      }
      case 3: {
        const picture: PropPicture = {
          position: 3,
          url: filenames[0],
          proposition: proposition,
        };
        const res = await this.pictureRepository.save(picture);
        pictures.push(res);
        break;
      }
      case 4: {
        filenames.forEach(async (item, position) => {
          const picture: PropPicture = {
            position: position + 1,
            url: item,
            proposition: proposition,
          };
          const res = await this.pictureRepository.save(picture);
          pictures.push(res);
        });
        break;
      }
      case 5: {
        filenames.forEach(async (item, pos) => {
          if (pos == 1) pos = 2;
          const picture: PropPicture = {
            position: pos + 1,
            url: item,
            proposition: proposition,
          };
          const res = await this.pictureRepository.save(picture);
          pictures.push(res);
        });
        break;
      }
      case 6: {
        filenames.forEach(async (item, position) => {
          position++;
          const picture: PropPicture = {
            position: position + 1,
            url: item,
            proposition: proposition,
          };
          const res = await this.pictureRepository.save(picture);
          pictures.push(res);
        });
        break;
      }
      case 7: {
        filenames.forEach(async (item, position) => {
          const picture: PropPicture = {
            position: position + 1,
            url: item,
            proposition: proposition,
          };
          const res = await this.pictureRepository.save(picture);
          pictures.push(res);
        });
        break;
      }
    }

    return pictures;
  }

  public async createPictures(proposition: Proposition, filenames: string[]) {
    const pictures: PropPicture[] = [];
    filenames.forEach(async (item, index) => {
      const picture: PropPicture = {
        position: index + 1,
        url: item,
        proposition: proposition,
      };
      const res = await this.pictureRepository.save(picture);
      pictures.push(res);
    });

    return pictures;
  }

  public async editPictures(
    filenames: string[],
    tabIndex: number[],
    proposition: Proposition,
  ) {
    const pictures: PropPicture[] = [];
    filenames.forEach(async (item, index) => {
      const picture: PropPicture = {
        position: tabIndex[index],
        url: item,
        proposition: proposition,
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
