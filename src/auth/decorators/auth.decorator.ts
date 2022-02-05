import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../roles/decorator/roles.decorator';
import { RoleGuard } from '../roles/guards/role.guard';
import { Role } from '../roles/role.enum';

export function JwtAuth(...roles: Role[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, RoleGuard), Roles(...roles));
}
