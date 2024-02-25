import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/api/admin/users/entities/user.entity';
import { UsersService } from 'src/api/admin/users/users.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class UnauthenticatedGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return true;
    }
    try {
      const { id } = (await this.jwtService.verifyAsync(token)) as User;
      await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });
    } catch {
      return true;
    }
    throw new UnauthorizedException();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
