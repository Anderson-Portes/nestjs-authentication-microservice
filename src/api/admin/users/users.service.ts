import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { User } from './entities/user.entity';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async checkEmailIsUnique(email: string, ignoreId?: string | null) {
    const count = await this.prisma.user.count({
      where: { email, id: { not: ignoreId } },
    });
    return count == 0;
  }

  async create(data: CreateUserDto): Promise<User> {
    const uniqueEmail = await this.checkEmailIsUnique(data.email);
    if (!uniqueEmail) {
      throw new BadRequestException({
        errors: { email: 'Email already in use' },
      });
    }
    data.password = await bcrypt.hash(data.password, 10);
    return await this.prisma.user.create({ data });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({ where });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    await this.findOne({ id });
    if (data.email && !(await this.checkEmailIsUnique(data.email, id))) {
      throw new BadRequestException({
        errors: { email: 'Email already in use' },
      });
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne({ id });
    await this.prisma.user.delete({ where: { id } });
    return {
      message: 'User deleted successfully.',
    };
  }
}
