import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  public async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const user: Partial<User> = { ...createUserDto };
    return await this.save(user);
  }

  public async editPassword(id: number, password: string) {
    password = await bcrypt.hash(password, 10);
    return this.update({ id: id }, { password: password });
  }
}
