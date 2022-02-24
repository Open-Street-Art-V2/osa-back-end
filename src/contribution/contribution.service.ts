import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Art } from 'src/art/art.entity';
import { ArtRepository } from 'src/art/art.repository';
import { Picture } from 'src/art/picture/picture.entity';
import { PictureService } from 'src/art/picture/picture.service';
import { PropPictureService } from 'src/proposition/proposition-picture/proposition-picture.service';
//import { Picture } from 'src/art/picture/picture.entity';
//import { PropPictureService } from 'src/proposition/proposition-picture/proposition-picture.service';
import { User } from 'src/users/user.entity';
import { UsersRepository } from 'src/users/user.repository';
import { Repository } from 'typeorm';
import { contrubArt } from './contrub.entity';
import { ContributionDto } from './dto/contribution.dto';

@Injectable()
export class ContributionService {
  constructor(
    @InjectRepository(contrubArt)
    private contribRepository: Repository<contrubArt>,
    @InjectRepository(UsersRepository) private userRepository: UsersRepository,
    @InjectRepository(ArtRepository) private artRepository: ArtRepository,
    @Inject(PictureService) private pictureService: PictureService,
    @Inject(PropPictureService) private propPicService: PropPictureService,
  ) {}

  async findAll() {
    return await this.contribRepository.find();
  }

  async contribution(
    contribDto: ContributionDto,
    userId: number,
    artId: number,
    filenames?: string[],
  ): Promise<any> {
    const user: User = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const contribution: contrubArt = {
      id: artId,
      ...contribDto,
      user: user,
    };

    const contib = await this.contribRepository.save(contribution);

    if (filenames) {
      await this.propPicService.createPictures(contib, filenames);
    }
    return contib;
  }

  async validateContribution(idCont: number) {
    const contribution = await this.contribRepository.findOne(idCont);
    const {
      id,
      title,
      address,
      artist,
      city,
      description,
      latitude,
      longitude,
      index,
      pictures,
    } = {
      ...contribution,
    };

    const editArt: Art = new Art();
    editArt.id = id;
    editArt.title = title;
    editArt.address = address;
    editArt.artist = artist;
    editArt.city = city;
    editArt.description = description;
    editArt.latitude = latitude;
    editArt.latitude = longitude;

    const filenames: string[] = pictures.map((elt) => elt.url);

    const result = await this.artRepository.save(editArt);
    await this.contribRepository.delete(idCont);

    if (filenames) {
      const art = await this.artRepository.findOne(id);
      if (!art) {
        throw new NotFoundException('Art not found');
      }
      switch (index) {
        case 1: {
          const pictures: Picture[] = art.pictures.filter(
            (elt) => elt.position == 1,
          );
          const images: string[] = pictures.map((elt) => elt.url);
          this.pictureService.editPictures(filenames, [1], art);
          this.pictureService.removePicturesFromFileSystem(images);
          break;
        }
        case 2: {
          const pictures: Picture[] = art.pictures.filter(
            (elt) => elt.position == 2,
          );
          const images: string[] = pictures.map((elt) => elt.url);
          this.pictureService.editPictures(filenames, [2], art);
          this.pictureService.removePicturesFromFileSystem(images);
          break;
        }
        case 3: {
          const pictures: Picture[] = art.pictures.filter(
            (elt) => elt.position == 3,
          );

          const images: string[] = pictures.map((elt) => elt.url);
          this.pictureService.editPictures(filenames, [3], art);
          this.pictureService.removePicturesFromFileSystem(images);
          break;
        }
        case 4: {
          const pictures: Picture[] = art.pictures.filter(
            (elt) => elt.position == 1 || elt.position == 2,
          );

          const images: string[] = pictures.map((elt) => elt.url);
          this.pictureService.editPictures(filenames, [1, 2], art);
          this.pictureService.removePicturesFromFileSystem(images);
          break;
        }
        case 5: {
          const pictures: Picture[] = art.pictures.filter(
            (elt) => elt.position == 1 || elt.position == 3,
          );

          const images: string[] = pictures.map((elt) => elt.url);
          this.pictureService.editPictures(filenames, [1, 3], art);
          this.pictureService.removePicturesFromFileSystem(images);
          break;
        }
        case 6: {
          const pictures: Picture[] = art.pictures.filter(
            (elt) => elt.position == 3 || elt.position == 2,
          );

          const images: string[] = pictures.map((elt) => elt.url);
          this.pictureService.editPictures(filenames, [2, 3], art);
          this.pictureService.removePicturesFromFileSystem(images);
          break;
        }
        case 7: {
          const images: string[] = art.pictures.map((elt) => elt.url);
          this.pictureService.editPictures(filenames, [1, 2, 3], art);
          this.pictureService.removePicturesFromFileSystem(images);
        }
      }
    }

    return result;
  }
}
