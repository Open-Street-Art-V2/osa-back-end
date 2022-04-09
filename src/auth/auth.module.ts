import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { ForgotPwdService } from './forgotpwd/forgotpwd.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForgotPwd } from './forgotpwd/forgotpwd.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ForgotPwd]),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION') + 's',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ForgotPwdService],
  controllers: [AuthController],
})
export class AuthModule {}
