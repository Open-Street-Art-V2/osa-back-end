import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Art } from 'src/art/art.entity';
import { ArtRepository } from 'src/art/art.repository';
import { Picture } from 'src/art/picture/picture.entity';
import { PictureService } from 'src/art/picture/picture.service';
import { User } from 'src/users/user.entity';
import { UsersRepository } from 'src/users/user.repository';
import { IsNull, Not, Repository } from 'typeorm';
import { CreatePropositionDto } from '../dto/create-proposition.dto';
import { Proposition } from '../entities/proposition.entity';
import { PropPictureService } from '../proposition-picture/proposition-picture.service';

@Injectable()
export class ContributionService {
  constructor(
    @InjectRepository(Proposition)
    private propRepository: Repository<Proposition>,
    @InjectRepository(UsersRepository) private userRepository: UsersRepository,
    @InjectRepository(ArtRepository) private artRepository: ArtRepository,
    @Inject(PropPictureService) private propPicService: PropPictureService,
    @Inject(PictureService) private pictureService: PictureService,
  ) {}

  // Find All contribution ---> Default : 20 per pages

  async findAllContribution(
    options: IPaginationOptions,
  ): Promise<Pagination<Proposition>> {
    options.limit =
      options.limit > 20 || options.limit <= 0 ? 10 : options.limit;
    options.page = options.page <= 0 ? 1 : options.page;
    const result = await paginate<Proposition>(this.propRepository, options, {
      where: { art: Not(IsNull()) },
    });
    return result;
  }

  // Get user contribution

  async getUserContribution(userId: number, options: IPaginationOptions) {
    options.limit =
      options.limit > 20 || options.limit <= 0 ? 10 : options.limit;
    options.page = options.page <= 0 ? 1 : options.page;
    const result = await paginate<Proposition>(this.propRepository, options, {
      where: { user: userId },
    });
    return result;
  }

  // Add contribution

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

  // Find contribution by Id

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

  //Validate One contribition by Id

  async validateContribution(tabId: number[]) {
    const response = { validated: [], notFound: [] };
    try {
      await Promise.all(
        tabId.map(async (id) => {
          const prop = await this.propRepository.findOne(id);
          if (prop) {
            const { id, art, ...contribArt }: { id?: number; art?: Art } & Art =
              prop;
            console.log(prop);
            if (art.id) {
              const updatedArt: Art = new Art();
              // updatedArt={...contribArt}
              updatedArt.id = art.id;
              updatedArt.title = contribArt.title;
              updatedArt.description = contribArt.description;
              updatedArt.artist = contribArt.artist;
              updatedArt.address = contribArt.address;
              updatedArt.city = contribArt.city;
              updatedArt.latitude = contribArt.latitude;
              updatedArt.longitude = contribArt.longitude;

              await this.artRepository.save(updatedArt);

              await this.propRepository.delete(id);

              const tabIndex: number[] = [];
              contribArt.pictures.forEach((elt, indice) => {
                tabIndex[indice] = Number(elt.position);
              });

              const filenames: string[] = contribArt.pictures.map(
                (elt) => elt.url,
              );
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

              response.validated.push(id);
            }
          } else {
            response.notFound.push(id);
          }
        }),
      );
    } catch (error) {
      throw error;
    }
    return response;
  }

  /*Validate a lot of contribution the same time

  async validateManyContribution(tabId: number[]) {
    try {
      await Promise.all(
        tabId.map(async (identifiant) => {
          this.validateContribution(identifiant);
        }),
      );
    } catch (error) {
      throw error;
    }
  }*/

  // Delete one contribution
  async remove(id: number, user: any) {
    try {
      const prop: Proposition = await this.propRepository.findOne(id);
      if (!prop)
        throw new NotFoundException(`Contribution with id:${id} was not found`);
      if (prop.user.id === user.id || user.role === 'ROLE_ADMIN') {
        const pics: string[] = prop.pictures.map((pic) => pic.url);
        await this.propPicService.removePicturesFromFileSystem(pics);
        return await this.propRepository.remove(prop);
      } else {
        throw new UnauthorizedException(
          'Must own the contribution to be able to delete it',
        );
      }
    } catch (err) {
      throw err;
    }
  }

  //remove a lot of contribution the same time

  async deleteManyContribution(tabId: number[], user: any) {
    const response = { removed: [], notFound: [], notAuthorized: [] };

    try {
      await Promise.all(
        tabId.map(async (id) => {
          const prop = await this.propRepository.findOne(id);
          if (!prop) {
            response.notFound.push(id);
          } else if (prop.user.id === user.id || user.role === 'ROLE_ADMIN') {
            this.propRepository.remove(prop);
            response.removed.push(id);
          } else {
            response.notAuthorized.push(id);
          }
        }),
      );
    } catch (err) {
      throw err;
    }
    return response;
  }
}
