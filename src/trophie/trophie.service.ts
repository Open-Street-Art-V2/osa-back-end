import { Injectable } from '@nestjs/common';
import { CreateTrophieDto } from './dto/create-trophie.dto';
import { UpdateTrophieDto } from './dto/update-trophie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Trophie } from './entities/trophie.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class TrophieService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Trophie)
    private trophieRepository: Repository<Trophie>,
  ) {}

  async insertTrophieToUser(userId, trophieName) {
    const trophie = await this.trophieRepository.findOne({
      where: {
        name: trophieName,
      },
    });
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['trophies'],
    });
    user.trophies.push(trophie);
    return await this.userRepository.save(user);
  }

  async findAllTrophies(
    options: IPaginationOptions,
    userId: number,
  ): Promise<Pagination<Trophie>> {
    options.limit =
      options.limit > 20 || options.limit <= 0 ? 10 : options.limit;
    options.page = options.page <= 0 ? 1 : options.page;
    const user = await this.userRepository.findOne({
      relations: ['trophies'],
      where: { id: userId },
    });
    let trophies = user.trophies.map((trophie) => trophie.id);
    if (trophies.length === 0) trophies = [0];
    const result = await paginate<Trophie>(this.trophieRepository, options, {
      where: { id: In(trophies) },
    });
    return result;
  }

  create(createTrophieDto: CreateTrophieDto) {
    return 'This action adds a new trophie';
  }

  findAll() {
    return this.trophieRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} trophie`;
  }

  update(id: number, updateTrophieDto: UpdateTrophieDto) {
    return `This action updates a #${id} trophie`;
  }

  remove(id: number) {
    return `This action removes a #${id} trophie`;
  }
}
