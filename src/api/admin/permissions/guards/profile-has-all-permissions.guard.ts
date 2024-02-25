import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class ProfileHasAllPermissionsGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allPermissions = this.reflector.getAllAndOverride<string[]>(
      'all-permissions',
      [context.getHandler(), context.getClass()],
    );
    if (!allPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return allPermissions.every((permission: string) =>
      user.permissions.includes(permission),
    );
  }
}
