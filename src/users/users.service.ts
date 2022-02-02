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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  public async getUserByLogin(email: string): Promise<User> {
    const findUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    return findUser;
  }

  public async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    return await this.usersRepository.createUser(createUserDTO);
  }

  public async deleteUser(id: number){
    return await this.usersRepository.delete({id: id});
  }

  public async changePassword(password: PasswordDTO, id: number) {
    const user: User = await this.usersRepository.findOne(id);
    try {
      return this.usersRepository.editPassword(password, user);
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
    return await this.usersRepository.update(
      { id: id },
      { ...updateUserProfileDTO },
    );
  }

  public async changeRole(id: number, role: Role) {
    return await this.usersRepository.update({ id: id }, { role: role });
  }
}
