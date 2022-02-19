/* eslint-disable */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { Art } from 'src/art/art.entity';
// import { ArtRepository } from 'src/art/art.repository';
import { User } from 'src/users/user.entity';
import { UsersRepository } from 'src/users/user.repository';
import { Repository } from 'typeorm';
import { CreatePropositionDto } from './dto/create-proposition.dto';
import { Proposition } from './entities/proposition.entity';
import { PropPictureService } from './proposition-picture/proposition-picture.service';
// import { UpdatePropositionDto } from './dto/update-proposition.dto';

@Injectable()
export class PropositionService {
  constructor(
    @InjectRepository(Proposition)
    private propRepository: Repository<Proposition>,
    @InjectRepository(UsersRepository) private userRepository: UsersRepository,
    //@InjectRepository(ArtRepository) private artRepository: ArtRepository,
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
      // const art: Art = await this.artRepository.findOne({
      //   where: {
      //     id: createPropositionDto.artId,
      //   },
      // });
      // if (!art) throw new NotFoundException('Art not found');
      const { /*artId,*/ ...prop } = {
        ...createPropositionDto,
        // art: art,
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

  findAll() {
    return `This action returns all proposition`;
  }

  findOne(id: number) {
    return `This action returns a #${id} proposition`;
  }

  update(id: number /*updatePropositionDto: UpdatePropositionDto*/) {
    return `This action updates a #${id} proposition`;
  }

  remove(id: number) {
    return `This action removes a #${id} proposition`;
  }
}
