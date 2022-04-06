import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pwd: string): Promise<any> {
    const user = await this.usersService.getUserByLogin(email);
    const isPasswordMatching = await bcrypt.compare(pwd, user.password);
    if (isPasswordMatching) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...validatedUser } = user;
      return validatedUser;
    }
    throw new HttpException(
      'Wrong credentials provided',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDTO: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);
    try {
      const createdUser = await this.usersService.createUser({
        ...createUserDTO,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === 'ER_DUP_ENTRY') {
        this.logger.error(
          'DUPLICATE ENTRY FOR USER IN USERS TABLE (user already exists)',
          error.stack,
        );
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
