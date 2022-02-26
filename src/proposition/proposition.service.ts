/* eslint-disable */
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
//import { cp } from 'fs';
import { Art } from 'src/art/art.entity';
import { ArtRepository } from 'src/art/art.repository';
import { Picture } from 'src/art/picture/picture.entity';
import { PictureService } from 'src/art/picture/picture.service';
import { User } from 'src/users/user.entity';
import { UsersRepository } from 'src/users/user.repository';
import { IsNull, Not, Repository } from 'typeorm';
import { CreatePropositionDto } from './dto/create-proposition.dto';
import { UpdatePropositionDto } from './dto/update-proposition.dto';
import { Proposition } from './entities/proposition.entity';
import { PropPicture } from './proposition-picture/proposition-picture.entity';
import { PropPictureService } from './proposition-picture/proposition-picture.service';

@Injectable()
export class PropositionService {
  constructor(
    @InjectRepository(Proposition)
    private propRepository: Repository<Proposition>,
    @InjectRepository(UsersRepository) private userRepository: UsersRepository,
    @InjectRepository(ArtRepository) private artRepository: ArtRepository,
    @InjectRepository(Picture) private picRepository: Repository<Picture>,
    @Inject(PropPictureService) private propPicService: PropPictureService,
    @Inject(PictureService) private pictureService: PictureService,
  ) {}
  async create(
    createPropositionDto: CreatePropositionDto,
    userId: number,
    filenames?,
  ): Promise<any> {
    try {
      const user: User = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      if (!user) throw new NotFoundException('User not found');
      const { ...prop } = {
        ...createPropositionDto,
        user: user,
      };
      const proposition = await this.propRepository.save(prop);
      if (filenames) {
        console.log(filenames);
        await this.propPicService.createPictures(proposition, filenames);
      }
      return proposition;
    } catch (err) {
      throw err;
    }
  }
  async contribution(
    createPropositionDto: CreatePropositionDto,
    userId: number,
    artId: number,
    filenames?,
  ): Promise<any> {
    try {
      const user: User = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      if (!user) throw new NotFoundException('User not found');
      const updatedArt: Art = await this.artRepository.findOne(artId);

      const { ...contribution } = {
        ...createPropositionDto,
        art: updatedArt,
        user: user,
      };
      const proposition = await this.propRepository.save(contribution);

      if (filenames) {
        await this.propPicService.contributionPictures(
          proposition,
          filenames,
          createPropositionDto.index,
        );
      }
      return proposition;
    } catch (err) {
      throw err;
    }
  }

  async findAll() {
    return await this.propRepository.find();
  }

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<Proposition>> {
    options.limit =
      options.limit > 20 || options.limit <= 0 ? 20 : options.limit;
    options.page = options.page <= 0 ? 1 : options.page;
    const result = await paginate<Proposition>(this.propRepository, options, {
      where: { art: IsNull() },
    });
    return result;
  }

  async paginateContribution(
    options: IPaginationOptions,
  ): Promise<Pagination<Proposition>> {
    options.limit =
      options.limit > 20 || options.limit <= 0 ? 20 : options.limit;
    options.page = options.page <= 0 ? 1 : options.page;
    const result = await paginate<Proposition>(this.propRepository, options, {
      where: { art: Not(IsNull()) },
    });
    return result;
  }

  async findOne(id: number) {
    try {
      const prop: Proposition = await this.propRepository.findOne(id);
      if (!prop)
        throw new NotFoundException(`Proposition with id:${id} was not found`);
      return prop;
    } catch (err) {
      throw err;
    }
  }

  async findUserProposition(id: number, userId: number) {
    try {
      const prop: Proposition = await this.propRepository.findOne(id, {
        where: {
          user: userId,
        },
      });
      if (!prop)
        throw new NotFoundException(`Proposition with id:${id} was not found`);
      return prop;
    } catch (err) {
      throw err;
    }
  }

  async findUserPropositions(
    options: IPaginationOptions,
    userId: number,
  ): Promise<Pagination<Proposition>> {
    options.limit =
      options.limit > 20 || options.limit <= 0 ? 20 : options.limit;
    options.page = options.page <= 0 ? 1 : options.page;
    return paginate<Proposition>(this.propRepository, options, {
      where: {
        art: null,
        user: userId,
      },
    });
  }

  async update(
    id: number,
    userId: number,
    updatePropositionDto: UpdatePropositionDto,
    filenames?: string[],
  ) {
    try {
      const propToEdit = await this.propRepository.findOne(id);
      if (!propToEdit) {
        if (filenames && filenames.length > 0)
          this.propPicService.removePicturesFromFileSystem(filenames);
        throw new NotFoundException('Art not found');
      }
      if (userId !== propToEdit.user.id) {
        throw new UnauthorizedException(
          'Must own the proposition to be able to edit it',
        );
      }
      const { index, ...fieldsToUpdate } = updatePropositionDto;
      const result = await this.propRepository.update(
        { id: id },
        { ...fieldsToUpdate },
      );
      console.log(result);
      console.log(fieldsToUpdate);
      if (filenames) {
        switch (index) {
          case 1: {
            const pictures: PropPicture[] = propToEdit.pictures.filter(
              (elt) => elt.position == 1,
            );
            const images: string[] = pictures.map((elt) => elt.url);
            this.propPicService.editPictures(filenames, [1], propToEdit);
            this.propPicService.removePicturesFromFileSystem(images);
            break;
          }
          case 2: {
            const pictures: PropPicture[] = propToEdit.pictures.filter(
              (elt) => elt.position == 2,
            );
            const images: string[] = pictures.map((elt) => elt.url);
            this.propPicService.editPictures(filenames, [2], propToEdit);
            this.propPicService.removePicturesFromFileSystem(images);
            break;
          }
          case 3: {
            const pictures: PropPicture[] = propToEdit.pictures.filter(
              (elt) => elt.position == 3,
            );

            const images: string[] = pictures.map((elt) => elt.url);
            this.propPicService.editPictures(filenames, [3], propToEdit);
            this.propPicService.removePicturesFromFileSystem(images);
            break;
          }
          case 4: {
            const pictures: PropPicture[] = propToEdit.pictures.filter(
              (elt) => elt.position == 1 || elt.position == 2,
            );

            const images: string[] = pictures.map((elt) => elt.url);
            this.propPicService.editPictures(filenames, [1, 2], propToEdit);
            this.propPicService.removePicturesFromFileSystem(images);
            break;
          }
          case 5: {
            const pictures: PropPicture[] = propToEdit.pictures.filter(
              (elt) => elt.position == 1 || elt.position == 3,
            );

            const images: string[] = pictures.map((elt) => elt.url);
            this.propPicService.editPictures(filenames, [1, 3], propToEdit);
            this.propPicService.removePicturesFromFileSystem(images);
            break;
          }
          case 6: {
            const pictures: PropPicture[] = propToEdit.pictures.filter(
              (elt) => elt.position == 3 || elt.position == 2,
            );

            const images: string[] = pictures.map((elt) => elt.url);
            this.propPicService.editPictures(filenames, [2, 3], propToEdit);
            this.propPicService.removePicturesFromFileSystem(images);
            break;
          }
          case 7: {
            const images: string[] = propToEdit.pictures.map((elt) => elt.url);
            this.propPicService.editPictures(filenames, [1, 2, 3], propToEdit);
            this.propPicService.removePicturesFromFileSystem(images);
          }
          default:
            break;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number, user: any) {
    try {
      const prop: Proposition = await this.propRepository.findOne(id);
      if (!prop)
        throw new NotFoundException(`Proposition with id:${id} was not found`);
      if (prop.user.id === user.id || user.role === 'ROLE_ADMIN') {
        const pics: string[] = prop.pictures.map((pic) => pic.url);
        await this.propPicService.removePicturesFromFileSystem(pics);
        return await this.propRepository.remove(prop);
      } else {
        throw new UnauthorizedException(
          'Must own the proposition to be able to delete it',
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async removeBatch(props: number[], userId: number) {
    let result = { validated: [], notFound: [], notAuthorized: [] };
    try {
      await Promise.all(
        props.map(async (id) => {
          const prop = await this.propRepository.findOne(id);
          if (!prop) {
            result.notFound.push(id);
          } else if (prop.user.id === userId) {
            this.propRepository.remove(prop);
            result.validated.push(id);
          } else {
            result.notAuthorized.push(id);
          }
        }),
      );
    } catch (err) {
      throw err;
    }
    return result;
  }

  async validate(props: number[]) {
    let result = { validated: [], notFound: [] };
    console.log('hahaha');
    try {
      await Promise.all(
        props.map(async (item) => {
          const prop = await this.propRepository.findOne(item, {
            where: { art: IsNull() },
          });
          if (prop) {
            const { id, art, ...newArt }: { id?: number; art?: Art } & Art =
              prop;
            const savedArt = await this.artRepository.save(newArt);
            if (newArt.pictures && newArt.pictures.length > 0) {
              const pictures: Picture[] = [];
              newArt.pictures.forEach((pic) => {
                const picture: Picture = { ...pic, art: savedArt };
                pictures.push(picture);
              });
              await this.picRepository.save(pictures);
              await this.propRepository.remove(prop);
            }
            result.validated.push(item);
          } else {
            result.notFound.push(item);
          }
        }),
      );
    } catch (err) {
      throw err;
    }
    return result;
  }

  async validateContribution(id: number) {
    let result;
    const prop = await this.propRepository.findOne(id);
    if (prop) {
      const { id, art, ...contribArt }: { id?: number; art?: Art } & Art = prop;
      console.log(prop);
      if (art.id) {
        let updatedArt: Art = new Art();
        // updatedArt={...contribArt}
        updatedArt.id = art.id;
        updatedArt.title = contribArt.title;
        updatedArt.description = contribArt.description;
        updatedArt.artist = contribArt.artist;
        updatedArt.address = contribArt.address;
        updatedArt.city = contribArt.city;
        updatedArt.latitude = contribArt.latitude;
        updatedArt.longitude = contribArt.latitude;

        result = await this.artRepository.save(updatedArt);

        await this.propRepository.delete(id);

        let tabIndex: number[] = [];
        contribArt.pictures.forEach((elt, indice) => {
          tabIndex[indice] = Number(elt.position);
        });

        const filenames: string[] = contribArt.pictures.map((elt) => elt.url);
        if (filenames) {
          const pictures: Picture[] = art.pictures.filter((elt) => {
            //tabIndex.findIndex(elt.position)!=-1
            return (
              elt.position == tabIndex[0] ||
              elt.position == tabIndex[1] ||
              elt.position == tabIndex[2]
            );
          }); //art.pictures.map((elt) => elt.url);
          const images: string[] = pictures.map((img) => img.url);

          this.pictureService.editPictures(filenames, tabIndex, art);
          this.pictureService.removePicturesFromFileSystem(images);
        }
      }
    }
    return result;
  }
}
