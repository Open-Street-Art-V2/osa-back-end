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
      if (filenames) {
        await this.createPictures(result.id, filenames);
      }
      return result;
    } catch (err) {
      if (filenames) {
        this.removePicturesFromFileSystem(filenames);
      }
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
    return await this.artRepository.find();
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
  ): Promise<Art> {
    const editedArt = await this.artRepository.findOne(artId);
    if (!editedArt) {
      throw new NotFoundException('Art not found');
    }
    try {
      return await this.artRepository.editArt(updateArtDto, editedArt);
    } catch (err) {
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

  public async deleteArt(artId: number) {
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

    const countPictures = await this.pictureRepository.count({
      where: {
        art: art,
      },
    });

    // check the pictures number of the art
    if (3 - countPictures < filenames.length) {
      // remove pictures from the file system
      this.removePicturesFromFileSystem(filenames);
      throw new HttpException(
        'Art with id ' + artId + ' has already ' + countPictures + ' pictures',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const pictures: Picture[] = [];
    for (const filename of filenames) {
      const picture: Picture = {
        url: filename,
        art: art,
      };
      const res = await this.pictureRepository.save(picture);
      pictures.push(res);
    }
    return pictures;
  }

  private removePicturesFromFileSystem(filenames: string[]) {
    // remove pictures from the file system
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    try {
      filenames.map((filename) => {
        const path = `${process.env.IMAGE_DEST}/${filename}`;
        fs.unlinkSync(path);
      });
    } catch (err) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
