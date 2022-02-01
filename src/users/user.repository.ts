import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { PasswordDTO } from './dto/update-password.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  public async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const user: Partial<User> = { ...createUserDto };
    return await this.save(user);
  }

  public async editPassword(pw: PasswordDTO, user: User) {
    user.password = await bcrypt.hash(pw.password, 10);
    const { ...editedUser } = await this.save(user);
    return editedUser;
  }
}
