import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ProfileHasAllPermissionsGuard } from '../guards/profile-has-all-permissions.guard';
import { AuthenticatedGuard } from 'src/api/auth/guards/authenticated.guard';

export const ProfileHasAllPermissions = (...permissions: string[]) => {
  return applyDecorators(
    SetMetadata('all-permissions', permissions),
    UseGuards(AuthenticatedGuard, ProfileHasAllPermissionsGuard),
  );
};
