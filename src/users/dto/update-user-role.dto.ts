import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/auth/roles/role.enum';

export class UpdateUserRoleDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
