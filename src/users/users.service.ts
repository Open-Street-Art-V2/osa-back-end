import { CreateUserDTO } from './dto/create-user.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersRepository } from './user.repository';
import { PasswordDTO } from './dto/update-password.dto';
import { Role } from 'src/auth/roles/role.enum';
import { UpdateUserProfileDTO } from './dto/update-user-profile.dto';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from 'src/proposition/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  public async findOneEmail(email: string) {
    return await this.usersRepository.findOne({ email });
  }

  public async profile(userId: number) {
    const result = await this.usersRepository.findOne(userId, {
      where: { blocked: false },
    });
    if (!result)
      throw new HttpException(
        `User with id:${userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    const { arts, ...user } = result;
    return {
      ...user,
      arts: arts.length,
    };
  }

  public async userProfile(userId: number) {
    const result = await this.usersRepository.findOne(userId, {
      where: { blocked: false },
    });
    if (!result)
      throw new HttpException(
        `User with id:${userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    const { id, email, birthDate, role, created_at, arts, ...user } = result;
    return {
      ...user,
      arts: arts.length,
    };
  }

  public async getUserByLogin(email: string): Promise<User> {
    const findUser = await this.usersRepository.findOne({
      where: { email },
      select: ['email', 'password', 'id', 'role', 'blocked'],
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    } else if (findUser.blocked == true)
      throw new HttpException('Account blocked', HttpStatus.UNAUTHORIZED);
    return findUser;
  }

  public async getUsersByFullname(
    fullname: string,
    paginationOptions: PaginationDto,
  ) {
    paginationOptions.limit =
      paginationOptions.limit > 20 || paginationOptions.limit <= 0
        ? 20
        : paginationOptions.limit;
    paginationOptions.page =
      paginationOptions.page <= 0 ? 1 : paginationOptions.page;
    try {
      const result = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoin('user.arts', 'arts')
        .select('user.id', 'id')
        .addSelect('user.firstname', 'firstname')
        .addSelect('user.name', 'name')
        .addSelect('user.favoriteCity', 'favoriteCity')
        .addSelect('COUNT(arts.id)', 'arts')
        .where(
          "concat_ws(' ',name,firstname) LIKE :fullname OR concat_ws(' ',firstname,name) LIKE :fullname",
          {
            fullname: '%' + fullname.split(' ').join('% %') + '%',
          },
        )
        .groupBy('user.id')
        .limit(paginationOptions.limit)
        .offset(paginationOptions.limit * (paginationOptions.page - 1))
        .getRawMany();
      return result;
    } catch (err) {
      console.log(err);
      throw new NotFoundException('User not found');
    }
  }

  public async getBlockedUsers() {
    return this.usersRepository.find({ blocked: true });
  }

  public async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    return await this.usersRepository.createUser(createUserDTO);
  }

  public async deleteUser(id: number) {
    return await this.usersRepository.delete({ id: id });
  }

  public async changePassword(password: PasswordDTO, id: number) {
    try {
      return await this.usersRepository.editPassword(id, password.password);
    } catch (err) {
      throw new HttpException(
        'Internal Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async editProfile(
    updateUserProfileDTO: UpdateUserProfileDTO,
    id: number,
  ) {
    if (updateUserProfileDTO.password) {
      updateUserProfileDTO.password = await bcrypt.hash(
        updateUserProfileDTO.password,
        10,
      );
    }
    const result = await this.usersRepository.update(
      { id: id },
      { ...updateUserProfileDTO },
    );
    return result;
  }

  public async block(id: number, blocked: boolean) {
    try {
      const result = await this.usersRepository.update(
        { id: id },
        { blocked: blocked },
      );
      if (result && result.affected === 0)
        throw new NotFoundException('User not found');
      return result;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new HttpException('Block failed', HttpStatus.BAD_REQUEST);
    }
  }

  public async changeRole(id: number /*role: Role*/) {
    return await this.usersRepository.update({ id: id }, { role: Role.ADMIN });
  }
}
