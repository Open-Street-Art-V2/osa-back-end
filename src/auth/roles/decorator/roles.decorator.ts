import { SetMetadata } from '@nestjs/common';
import { Role } from '../role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('ROLES_ENTRY', roles);
