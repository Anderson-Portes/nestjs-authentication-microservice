import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ProfileDto } from './dto/profile.dto';
import { UsersService } from '../admin/users/users.service';
import { User } from '../admin/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(data: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      const message = 'These credentials do not match our records.';
      throw new BadRequestException({
        errors: { email: message, password: message },
      });
    }
    const { password, ...result } = user;
    return {
      accessToken: await this.jwtService.signAsync(result),
    };
  }

  async register(data: ProfileDto) {
    const { id: userRoleId } = await this.prisma.role.findUnique({
      where: { name: 'User' },
    });
    data.roleId = userRoleId;
    return await this.usersService.create(data);
  }

  async updateProfile(profile: User, data: ProfileDto) {
    return await this.usersService.update(profile.id, data);
  }
}
