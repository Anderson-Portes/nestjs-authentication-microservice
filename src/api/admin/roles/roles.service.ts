import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRoleDto) {
    const role = await this.prisma.role.findUnique({
      where: { name: data.name },
    });
    if (role) {
      const errors = { name: 'Role already exists.' };
      throw new BadRequestException({ errors });
    }
    return await this.prisma.role.create({ data });
  }

  async findAll() {
    return await this.prisma.role.findMany();
  }

  async findOne(where: Prisma.RoleWhereInput) {
    const role = await this.prisma.role.findFirst({ where });
    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }

  async update(id: string, data: UpdateRoleDto) {
    const role = await this.prisma.role.findFirst({
      where: { name: UpdateRoleDto.name, id: { not: id } },
    });
    if (role) {
      const errors = { name: 'Role already exists.' };
      throw new BadRequestException({ errors });
    }
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.prisma.role.delete({ where: { id } });
    return {
      message: 'Role deleted successfully.',
    };
  }
}
