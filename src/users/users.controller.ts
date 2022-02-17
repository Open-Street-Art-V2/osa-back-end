import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Req,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { PasswordDTO } from './dto/update-password.dto';
import { UpdateUserProfileDTO } from './dto/update-user-profile.dto';
import { UpdateUserRoleDTO } from './dto/update-user-role.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

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
    @Body() updateUserRoleDTO: UpdateUserRoleDTO,
  ) {
    await this.usersService.changeRole(id, updateUserRoleDTO.role);
    return {
      statusCode: 200,
      message: 'User role altered successfully!',
    };
  }
}
