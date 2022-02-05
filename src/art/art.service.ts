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

  public async createArt(createArtDto: CreateArtDto, filename: string) {
    try {
      const result = await this.artRepository.createArt(createArtDto);
      if (filename) {
        const picture: Picture = {
          url: filename,
          art: result,
        };
        await this.pictureRepository.save(picture);
      }
      return result;
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

  public async createPicture(artId: number, filename: string) {
    try {
      const art = await this.artRepository.findOne(artId);
      if (!art) {
        throw new NotFoundException('Art not found');
      }

      //TODO: envoyer une exeption quand il y a déjà 3 images pour cette
      // oeuvre dans la base de données
      // const countPictures = await this.pictureRepository.count({
      //   where: {
      //     art: art,
      //   },
      // });
      // if (countPictures === 3) {
      //   throw new HttpException(
      //     "Art with 'id':'" + artId + "' has already three pictures",
      //     HttpStatus.NOT_ACCEPTABLE,
      //   );
      // }

      const picture: Picture = {
        url: filename,
        art: art,
      };
      return await this.pictureRepository.save(picture);
    } catch (err) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
