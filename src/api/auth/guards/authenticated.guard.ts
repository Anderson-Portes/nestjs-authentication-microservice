import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/api/admin/users/entities/user.entity';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const { id } = (await this.jwtService.verifyAsync(token)) as User;
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });
      const rolePermissions = await this.prisma.rolePermission.findMany({
        where: { roleId: user.roleId },
        include: {
          permission: true,
        },
      });
      request.user = {
        ...user,
        permissions: rolePermissions.map(
          (rolePermission) => rolePermission.permission.name,
        ),
      };
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
