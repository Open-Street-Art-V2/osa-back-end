import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
const nodemailer = require('nodemailer');
import { ForgotPwdService } from 'src/auth/forgotpwd/forgotpwd.service';
import { ForgotPwd } from './forgotpwd/forgotpwd.entity';
// require('dotenv').process.env();

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly forgotpwdService: ForgotPwdService,
  ) {}

  async validateUser(email: string, pwd: string): Promise<any> {
    const user = await this.usersService.getUserByLogin(email);
    const isPasswordMatching = await bcrypt.compare(pwd, user.password);
    if (isPasswordMatching) {
      // eslint-disable-next-line @typescript-eslint/no-unused-consts
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
      this.logger.log(
        `Account created with following email : ${createdUser.email}`,
      );
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

  async sendEmailForgotPassword(email: string): Promise<boolean> {
    const userFromDb = await this.usersService.findOneEmail(email);
    if (!userFromDb)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    const tokenModel = await this.createForgottenPasswordToken(email);

    if (tokenModel && tokenModel.newPasswordToken) {
      // {
      //   host: process.env.MAIL_HOST,
      //   port: Number(process.env.MAIL_PORT),
      //   secure: process.env.MAIL_SECURE, // true for 465, false for other ports
      //   auth: {
      //     user: process.env.MAIL_USER,
      //     pass: process.env.MAIL_PWD,
      //   },
      // }
      // const smtpConfig = {
      //   host: process.env.MAIL_HOST,
      //   port: parseInt(process.env.MAIL_PORT),
      //   secure: false, // upgrade later with STARTTLS
      //   auth: {
      //     user: process.env.MAIL_USER,
      //     pass: process.env.MAIL_PWD,
      //   },
      // };
      const smtpConfig = {
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PWD,
        },
      };
      console.log('before creating transport');
      let transporter;
      try {
        transporter = nodemailer.createTransport(smtpConfig);
      } catch (error) {
        console.log(error);
      }
      console.log('after creating transport');
      let mailOptions = {
        from: 'Open Street Art V2',
        to: email, // list of receivers (separated by ,)
        subject: 'Frogotten Password',
        html:
          'Hi! <br><br> If you requested to reset your password<br><br>' +
          '<a href=' +
          process.env.HOST +
          ':' +
          process.env.PORT_REAL +
          '/auth/reset-password/' +
          tokenModel.newPasswordToken +
          '>Click here</a>', // html body
      };
      var sent = await new Promise<boolean>(async function (resolve, reject) {
        return await transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.log('Message sent: %s', error);
            return reject(false);
          }
          console.log('Message sent: %s', info.messageId);
          resolve(true);
        });
      });

      return sent;
    } else {
      throw new HttpException(
        'REGISTER.USER_NOT_REGISTERED',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async createForgottenPasswordToken(email: string) {
    const forgottenPassword = await this.forgotpwdService.findOne({ email });
    if (
      forgottenPassword &&
      (new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000 <
        15
    ) {
      throw new HttpException(
        'RESET_PASSWORD.EMAIL_SENDED_RECENTLY',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      await this.forgotpwdService.create({
        email: email,
        newPasswordToken: (
          Math.floor(Math.random() * 9000000) + 1000000
        ).toString(), //Generate 7 digits number,
        timestamp: new Date(),
      });
      const forgottenPasswordModel = await this.forgotpwdService.findOne({
        email,
      });
      if (forgottenPasswordModel) {
        return forgottenPasswordModel;
      } else {
        // return forgottenPassword;
        console.log(forgottenPassword);
        throw new HttpException(
          'LOGIN.ERROR.GENERIC_ERROR',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getForgottenPasswordModel(
    newPasswordToken: string,
  ): Promise<ForgotPwd> {
    return await this.forgotpwdService.findOne({
      newPasswordToken: newPasswordToken,
    });
  }
}
