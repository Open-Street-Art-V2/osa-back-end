import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  Req,
  Body,
  Res,
  Get,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UserLoginDTO } from 'src/users/dto/user-login.dto';
import { AuthService } from './auth.service';
import { JwtAuth } from './decorators/auth.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Role } from './roles/role.enum';
import { ResetPasswordDto } from './forgotpwd/reset-password.dto';
import { UsersService } from 'src/users/users.service';
import { ForgotPwdService } from './forgotpwd/forgotpwd.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly forgotpwdService: ForgotPwdService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: UserLoginDTO })
  async login(@Req() request, @Res({ passthrough: true }) res: Response) {
    const jwt = await this.authService.login(request.user);
    res.setHeader('Authorization', jwt.access_token + '; HttpOnly; Secure;');
    return {
      statusCode: '200',
      user: request.user,
      jwt: jwt.access_token,
    };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDTO) {
    return this.authService.register(createUserDto);
  }

  @Get('forgot-password/:email')
  async sendEmailForgotPassword(@Param() params) {
    try {
      const isEmailSent = await this.authService.sendEmailForgotPassword(
        params.email,
      );
      console.log(isEmailSent);
      if (isEmailSent) {
        return 'email sent'; //email resent
      } else {
        return 'email not sent'; // email not resent
      }
    } catch (error) {
      return error;
    }
  }

  @Post('reset-password')
  @HttpCode(200)
  public async setNewPassord(@Body() resetPassword: ResetPasswordDto) {
    try {
      var isNewPasswordChanged: boolean = false;
      if (resetPassword.newPasswordToken) {
        var forgottenPasswordModel =
          await this.authService.getForgottenPasswordModel(
            resetPassword.newPasswordToken,
          );
        const user = await this.userService.findOneEmail(
          forgottenPasswordModel.email,
        );
        await this.userService.changePassword(
          { password: resetPassword.newPassword },
          user.id,
        );
        await this.forgotpwdService.remove(forgottenPasswordModel.email);
      } else {
        return 'RESET_PASSWORD.CHANGE_PASSWORD_ERROR';
      }
      return {
        msg: 'RESET_PASSWORD.PASSWORD_CHANGED',
        isNewPasswordChanged,
      };
    } catch (error) {
      return { msg: 'RESET_PASSWORD.CHANGE_PASSWORD_ERROR', error };
    }
  }

  @Get('test')
  @JwtAuth(Role.ADMIN, Role.USER)
  async test(@Req() req) {
    const user = req.user;
    return {
      statusCode: '200',
      message: 'Hello ' + user.email,
      user: req.user,
    };
  }
}
