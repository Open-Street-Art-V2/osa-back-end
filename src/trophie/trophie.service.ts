import { Injectable } from '@nestjs/common';
import { CreateTrophieDto } from './dto/create-trophie.dto';
import { UpdateTrophieDto } from './dto/update-trophie.dto';

@Injectable()
export class TrophieService {
  // constructor(
  //   @InjectRepository(User)
  //   private userRepository: Repository<User>,
  // ) {}

  // async findAllTrophies(
  //   options: IPaginationOptions,
  //   userId: number,
  // ): Promise<Pagination<Trophie>> {
  //   options.limit =
  //     options.limit > 20 || options.limit <= 0 ? 10 : options.limit;
  //   options.page = options.page <= 0 ? 1 : options.page;
  //   const result = await paginate<User>(this.userRepository, options, {
  //     where: { id: userId },
  //   });
  //   return result;
  // }

  create(createTrophieDto: CreateTrophieDto) {
    return 'This action adds a new trophie';
  }

  findAll() {
    return `This action returns all trophie`;
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
