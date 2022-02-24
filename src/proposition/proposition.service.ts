/* eslint-disable */
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Art } from 'src/art/art.entity';
import { ArtRepository } from 'src/art/art.repository';
import { Picture } from 'src/art/picture/picture.entity';
import { User } from 'src/users/user.entity';
import { UsersRepository } from 'src/users/user.repository';
import { Repository } from 'typeorm';
//import { contrubArt } from '../contribution/contrub.entity';
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

  /*async contribution(
    contribDto: CreatePropositionDto,
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

    const contib = await this.propRepository.save(contribution);

    if (filenames) {
      await this.propPicService.createPictures(contib, filenames);
    }
    return contib;
  }*/

  async findAll() {
    return await this.propRepository.find();
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

  async validate(props: number[]) {
    let result = { validated: [], notFound: [] };
    try {
      await Promise.all(
        props.map(async (item) => {
          const prop = await this.propRepository.findOne(item);
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
    console.log(result);
    return result;
  }

  async validateContribution(idCont: number) {
    const contribution = await this.propRepository.findOne(idCont);
    const {
      id,
      title,
      address,
      artist,
      city,
      description,
      latitude,
      longitude,
    } = {
      ...contribution,
    };

    const editArt: Art = new Art();
    editArt.id=id;
    editArt.title = title;
    editArt.address = address;
    editArt.artist = artist;
    editArt.city = city;
    editArt.description = description;
    editArt.latitude = latitude;
    editArt.latitude = longitude;

    await this.artRepository.save(editArt);
    await this.propRepository.delete(idCont);
  }
}
