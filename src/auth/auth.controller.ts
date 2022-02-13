import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  Req,
  Body,
  Res,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UserLoginDTO } from 'src/users/dto/user-login.dto';
import { AuthService } from './auth.service';
import { JwtAuth } from './decorators/auth.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Role } from './roles/role.enum';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
