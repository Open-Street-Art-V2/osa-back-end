import { UpdateArtDto } from './dto/update-art.dto';
import { ArtRepository } from './art.repository';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArtDto } from './dto/create-art.dto';
import { Art } from './art.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Picture } from './picture/picture.entity';

@Injectable()
export class ArtService {
  constructor(
    @InjectRepository(ArtRepository) private artRepository: ArtRepository,
    @InjectRepository(Picture) private pictureRepository: Repository<Picture>,
  ) {}

  public async createArt(createArtDto: CreateArtDto, filenames?: string[]) {
    try {
      const result = await this.artRepository.createArt(createArtDto);
      await this.createPictures(result.id, filenames);
      return result;
    } catch (err) {
      this.removePicturesFromFileSystem(filenames);
      switch (err.code) {
        case 'ER_DUP_ENTRY':
          throw new HttpException(
            'Art with same title already exists',
            HttpStatus.CONFLICT,
          );
        default:
          throw new HttpException(
            'Something went wrong',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  public async getArts(): Promise<Art[]> {
    const result = await this.artRepository.find();
    return result;
  }

  public async getArt(artId: number): Promise<Art> {
    const findArt = await this.artRepository.findOne(artId);
    if (!findArt) {
      throw new NotFoundException('Art not found');
    }
    return findArt;
  }

  public async getArtByTitle(title: string): Promise<Art> {
    const findArt = await this.artRepository.findOne({
      where: {
        title: title,
      },
    });

    if (!findArt) {
      throw new NotFoundException('Art not found');
    }
    return findArt;
  }

  public async getArtByArtist(artist: string): Promise<[Art[], number]> {
    const findArt = await this.artRepository.findAndCount({
      where: {
        artist: artist,
      },
    });

    if (!findArt) {
      throw new NotFoundException('Art not found');
    }
    return findArt;
  }

  public async editArt(
    artId: number,
    updateArtDto: UpdateArtDto,
    filenames?: string[],
  ): Promise<Art> {
    const editedArt = await this.artRepository.findOne(artId);
    //const images: string[] = editedArt.pictures.map((elt) => elt.url);
    if (!editedArt) {
      this.removePicturesFromFileSystem(filenames);
      throw new NotFoundException('Art not found');
    }
    try {
      if (filenames) {
        const result = await this.artRepository.editArt(
          updateArtDto,
          editedArt,
        );

        switch (Number(updateArtDto.index)) {
          case 1: {
            const pictures: Picture[] = editedArt.pictures.filter(
              (elt) => elt.position == 1,
            );
            const images: string[] = pictures.map((elt) => elt.url);
            await this.editPictures(artId, filenames, [1]);
            this.removePicturesFromFileSystem(images);
            break;
          }
          case 2: {
            const pictures: Picture[] = editedArt.pictures.filter(
              (elt) => elt.position == 2,
            );
            const images: string[] = pictures.map((elt) => elt.url);
            await this.editPictures(artId, filenames, [2]);
            this.removePicturesFromFileSystem(images);
            break;
          }
          case 3: {
            const pictures: Picture[] = editedArt.pictures.filter(
              (elt) => elt.position == 3,
            );

            const images: string[] = pictures.map((elt) => elt.url);
            await this.editPictures(artId, filenames, [3]);
            this.removePicturesFromFileSystem(images);
            break;
          }
          case 4: {
            const pictures: Picture[] = editedArt.pictures.filter(
              (elt) => elt.position == 1 || elt.position == 2,
            );

            const images: string[] = pictures.map((elt) => elt.url);
            await this.editPictures(artId, filenames, [1, 2]);
            this.removePicturesFromFileSystem(images);
            break;
          }
          case 5: {
            const pictures: Picture[] = editedArt.pictures.filter(
              (elt) => elt.position == 1 || elt.position == 3,
            );

            const images: string[] = pictures.map((elt) => elt.url);
            await this.editPictures(artId, filenames, [1, 3]);
            this.removePicturesFromFileSystem(images);
            break;
          }
          case 6: {
            const pictures: Picture[] = editedArt.pictures.filter(
              (elt) => elt.position == 3 || elt.position == 2,
            );

            const images: string[] = pictures.map((elt) => elt.url);
            await this.editPictures(artId, filenames, [2, 3]);
            this.removePicturesFromFileSystem(images);
            break;
          }
          case 7: {
            const images: string[] = editedArt.pictures.map((elt) => elt.url);
            await this.editPictures(artId, filenames, [1, 2, 3]);
            this.removePicturesFromFileSystem(images);
          }
        }
        return result;
      } else {
        return await this.artRepository.editArt(updateArtDto, editedArt);
      }
    } catch (err) {
      this.removePicturesFromFileSystem(filenames);
      switch (err.code) {
        case 'ER_DUP_ENTRY':
          throw new HttpException(
            'Art with same title already exists',
            HttpStatus.CONFLICT,
          );
        default:
          throw new HttpException(
            'Something went wrong ici',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  public async deleteArt(artId: number) {
    const pictures: Picture[] = await this.pictureRepository.find({
      where: { art: artId },
    });
    const picturesUrl: string[] = pictures.map((picture) => picture.url);
    this.removePicturesFromFileSystem(picturesUrl);
    const deleted: DeleteResult = await this.artRepository.delete(artId);
    if (deleted.affected === 0) {
      throw new HttpException(
        "Art with 'id':'" + artId + "' was not found",
        HttpStatus.NOT_FOUND,
      );
    }
    return deleted;
  }

  public async createPictures(artId: number, filenames: string[]) {
    // check if art exists
    const art = await this.artRepository.findOne(artId);
    if (!art) {
      throw new NotFoundException('Art not found');
    }

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

  public async editPictures(
    artId: number,
    filenames: string[],
    tabIndex: number[],
  ) {
    // check if art exists
    const art = await this.artRepository.findOne(artId);
    if (!art) {
      throw new NotFoundException('Art not found');
    }

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

  private removePicturesFromFileSystem(filenames: string[]) {
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
