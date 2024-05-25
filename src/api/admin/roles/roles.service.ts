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

  async create({ name, permissionsIds }: CreateRoleDto) {
    const roleExists = await this.prisma.role.findUnique({
      where: { name },
    });
    if (roleExists) {
      const errors = { name: 'Role already exists.' };
      throw new BadRequestException({ errors });
    }
    const role = await this.prisma.role.create({ data: { name } });
    await this.prisma.rolePermission.createMany({
      data: permissionsIds.map((id) => ({
        roleId: role.id,
        permissionId: id,
      })),
    });
    return role;
  }

  async findAll() {
    return await this.prisma.role.findMany({
      include: { rolePermissions: { include: { permission: true } } },
    });
  }

  async findOne(where: Prisma.RoleWhereInput) {
    const role = await this.prisma.role.findFirst({
      where,
      include: { rolePermissions: { include: { permission: true } } },
    });
    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }

  async update(id: string, data: UpdateRoleDto) {
    const roleExists = await this.prisma.role.findFirst({
      where: { name: UpdateRoleDto.name, id: { not: id } },
    });
    if (roleExists) {
      const errors = { name: 'Role already exists.' };
      throw new BadRequestException({ errors });
    }
    const { permissionsIds, ...result } = data;
    const role = await this.prisma.role.update({
      where: { id },
      data: result,
    });
    await this.prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    if (permissionsIds?.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: permissionsIds.map((id) => ({
          roleId: role.id,
          permissionId: id,
        })),
      });
    }
    return role;
  }

  async remove(id: string) {
    await this.prisma.role.delete({ where: { id } });
    return {
      message: 'Role deleted successfully.',
    };
  }
}
