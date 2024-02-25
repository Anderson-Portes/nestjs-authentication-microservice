import { Injectable } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Permission[]> {
    return await this.prisma.permission.findMany();
  }
}
