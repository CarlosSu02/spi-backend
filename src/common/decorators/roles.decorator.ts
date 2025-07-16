import { SetMetadata } from '@nestjs/common';
import { EUserRole } from 'src/modules/users/enums';

export const Roles = (...roles: EUserRole[]) => SetMetadata('roles', roles);
