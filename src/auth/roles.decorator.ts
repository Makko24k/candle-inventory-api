import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Usage:  @Roles('Admin')  means only Admin can use this endpoint
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);