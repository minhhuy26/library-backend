import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum.js';

export const ROLE_KEYS = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLE_KEYS, roles);
// Cú pháp tạo cus decorator
