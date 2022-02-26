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

  public async createPictures(proposition: Proposition, filenames: string[]) {
    // check if art exists

    // const countPictures = await this.pictureRepository.count({
    //   where: {
    //     art: art,
    //   },
    // });

    // check the pictures number of the art
    // if (3 - countPictures < filenames.length) {
    //   // remove pictures from the file system
    //   this.removePicturesFromFileSystem(filenames);
    //   throw new HttpException(
    //     'Art with id ' + artId + ' has already ' + countPictures + ' pictures',
    //     HttpStatus.NOT_ACCEPTABLE,
    //   );
    // }

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
