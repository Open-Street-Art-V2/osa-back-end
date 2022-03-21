import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { PasswordDTO } from './dto/update-password.dto';
import { UpdateUserProfileDTO } from './dto/update-user-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @JwtAuth(Role.ADMIN, Role.USER)
  async profile(@Req() request) {
    const profile = await this.usersService.profile(request.user?.id);
    return {
      statusCode: 200,
      profile,
    };
  }

  @Get('profile/:id')
  @JwtAuth(Role.ADMIN, Role.USER)
  async user(@Param('id', ParseIntPipe) id: number) {
    const profile = await this.usersService.userProfile(id);
    return {
      statusCode: 200,
      profile,
    };
  }

  @Get('search')
  async getUsersByFullname(@Body() body: { fullname: string }) {
    const result = await this.usersService.getUsersByFullname(body.fullname);
    return {
      statusCode: 200,
      results: result,
    };
  }

  @Get('blocked')
  @JwtAuth(Role.ADMIN)
  async getBlockedUsers() {
    const result = await this.usersService.getBlockedUsers();
    return {
      statusCode: 200,
      results: result,
    };
  }

  // Update logged in user profile info
  @Patch()
  @JwtAuth(Role.ADMIN, Role.USER)
  async updateProfile(
    @Body() updateUserProfileDTO: UpdateUserProfileDTO,
    @Req() req,
  ) {
    await this.usersService.editProfile(updateUserProfileDTO, req.user.id);
    return {
      statusCode: 200,
      message: 'Profile edited successfully!',
    };
  }

  // change logged in user password
  @ApiBody({ type: PasswordDTO })
  @Patch('password')
  @JwtAuth(Role.ADMIN, Role.USER)
  async changePassword(@Body() password: PasswordDTO, @Req() req) {
    await this.usersService.changePassword(password, req.user.id);
    return {
      statusCode: 200,
      message: 'Password was successfully changed!',
    };
  }

  @Patch('block/:id')
  @JwtAuth(Role.ADMIN)
  async blockUser(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.block(id, true);
    return {
      statusCode: 200,
      message: 'User blocked successfully!',
    };
  }

  @Patch('unblock/:id')
  @JwtAuth(Role.ADMIN)
  async unblockUser(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.block(id, false);
    return {
      statusCode: 200,
      message: 'User unblocked successfully!',
    };
  }

  // Delete user by id (for ADMINS)
  @Delete(':id')
  @JwtAuth(Role.ADMIN)
  async deleteUserByAdmin(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.deleteUser(id);
    return {
      statusCode: 200,
      message: 'User deleted successfully!',
    };
  }

  // Delete own account (for USERS, ADMINS)
  @Delete()
  @JwtAuth(Role.ADMIN, Role.USER)
  async deleteUser(@Req() req) {
    await this.usersService.deleteUser(req.user.id);
    return {
      statusCode: 200,
      message: 'Account deleted successfully!',
    };
  }

  // Change a user's role (For ADMINS)
  @Patch('role/:id')
  @JwtAuth(Role.ADMIN)
  async changeRole(
    @Param('id', ParseIntPipe) id: number,
    // @Body() updateUserRoleDTO: UpdateUserRoleDTO,
  ) {
    await this.usersService.changeRole(id /*updateUserRoleDTO.role*/);
    return {
      statusCode: 200,
      message: 'User role altered successfully!',
    };
  }
}
