import { UpdateArtDto } from './dto/update-art.dto';
import { ArtRepository } from './art.repository';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArtDto } from './dto/create-art.dto';
import { Art } from './art.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Picture } from './picture/picture.entity';
import { PictureService } from './picture/picture.service';
import { UsersRepository } from 'src/users/user.repository';
import { User } from 'src/users/user.entity';

@Injectable()
export class ArtService {
  constructor(
    @Inject(PictureService) private pictureService: PictureService,
    @InjectRepository(ArtRepository) private artRepository: ArtRepository,
    @InjectRepository(Picture) private pictureRepository: Repository<Picture>,
    @InjectRepository(UsersRepository) private userRepository: UsersRepository,
  ) {}

  public async createArt(
    createArtDto: CreateArtDto,
    userId: number,
    filenames: string[],
  ) {
    try {
      const user: User = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('User not found');
      const result = await this.artRepository.createArt(createArtDto, user);
      const art = await this.artRepository.findOne(result.id);
      if (!art) {
        throw new NotFoundException('Art not found');
      }
      await this.pictureService.createPictures(art, filenames);
      return result;
    } catch (err) {
      this.pictureService.removePicturesFromFileSystem(filenames);
      switch (err.code) {
        case 'ER_DUP_ENTRY':
          throw new HttpException(
            'Art with same title already exists',
            HttpStatus.CONFLICT,
          );
        default:
          throw new HttpException(
            err.message,
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
      this.pictureService.removePicturesFromFileSystem(filenames);
      throw new NotFoundException('Art not found');
    }
    try {
      if (filenames) {
        const result = await this.artRepository.editArt(
          updateArtDto,
          editedArt,
        );

        const art = await this.artRepository.findOne(artId);
        if (!art) {
          throw new NotFoundException('Art not found');
        }

        switch (Number(updateArtDto.index)) {
          case 1: {
            const pictures: Picture[] = editedArt.pictures.filter(
              (elt) => elt.position == 1,
            );
            const images: string[] = pictures.map((elt) => elt.url);
            this.pictureService.editPictures(filenames, [1], art);
            this.pictureService.removePicturesFromFileSystem(images);
            break;
          }
          case 2: {
            const pictures: Picture[] = editedArt.pictures.filter(
              (elt) => elt.position == 2,
            );
            const images: string[] = pictures.map((elt) => elt.url);
            this.pictureService.editPictures(filenames, [2], art);
            this.pictureService.removePicturesFromFileSystem(images);
            break;
          }
          case 3: {
            const pictures: Picture[] = editedArt.pictures.filter(
              (elt) => elt.position == 3,
            );

            const images: string[] = pictures.map((elt) => elt.url);
            this.pictureService.editPictures(filenames, [3], art);
            this.pictureService.removePicturesFromFileSystem(images);
            break;
          }
          case 4: {
            const pictures: Picture[] = editedArt.pictures.filter(
              (elt) => elt.position == 1 || elt.position == 2,
            );

            const images: string[] = pictures.map((elt) => elt.url);
            this.pictureService.editPictures(filenames, [1, 2], art);
            this.pictureService.removePicturesFromFileSystem(images);
            break;
          }
          case 5: {
            const pictures: Picture[] = editedArt.pictures.filter(
              (elt) => elt.position == 1 || elt.position == 3,
            );

            const images: string[] = pictures.map((elt) => elt.url);
            this.pictureService.editPictures(filenames, [1, 3], art);
            this.pictureService.removePicturesFromFileSystem(images);
            break;
          }
          case 6: {
            const pictures: Picture[] = editedArt.pictures.filter(
              (elt) => elt.position == 3 || elt.position == 2,
            );

            const images: string[] = pictures.map((elt) => elt.url);
            this.pictureService.editPictures(filenames, [2, 3], art);
            this.pictureService.removePicturesFromFileSystem(images);
            break;
          }
          case 7: {
            const images: string[] = editedArt.pictures.map((elt) => elt.url);
            this.pictureService.editPictures(filenames, [1, 2, 3], art);
            this.pictureService.removePicturesFromFileSystem(images);
          }
        }
        return result;
      } else {
        return await this.artRepository.editArt(updateArtDto, editedArt);
      }
    } catch (err) {
      this.pictureService.removePicturesFromFileSystem(filenames);
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
    this.pictureService.removePicturesFromFileSystem(picturesUrl);
    const deleted: DeleteResult = await this.artRepository.delete(artId);
    if (deleted.affected === 0) {
      throw new HttpException(
        "Art with 'id':'" + artId + "' was not found",
        HttpStatus.NOT_FOUND,
      );
    }
    return deleted;
  }
}
