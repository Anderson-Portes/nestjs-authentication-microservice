import { PrismaClient } from '.prisma/client';
import * as bcrypt from 'bcryptjs';

const main = async () => {
  const prisma = new PrismaClient();
  await prisma.$connect();
  await prisma.user.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();
  const { id: adminRoleId } = await prisma.role.create({
    data: { name: 'Admin' },
  });
  const { id: userRoleId } = await prisma.role.create({
    data: { name: 'User' },
  });
  const adminPermissions = [
    'list users',
    'show user',
    'create user',
    'edit user',
    'delete user',
    'list roles',
    'show role',
    'create role',
    'edit role',
    'delete role',
    'list permissions',
  ];
  const commonPermissions = ['show profile', 'edit profile'];
  for await (const name of adminPermissions) {
    const { id: permissionId } = await prisma.permission.create({
      data: { name },
    });
    await prisma.rolePermission.create({
      data: { roleId: adminRoleId, permissionId },
    });
  }
  for await (const name of commonPermissions) {
    const { id: permissionId } = await prisma.permission.create({
      data: { name },
    });
    await prisma.rolePermission.createMany({
      data: [
        { roleId: userRoleId, permissionId },
        { roleId: adminRoleId, permissionId },
      ],
    });
  }
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@email.com',
      password: await bcrypt.hash('password', 10),
      roleId: adminRoleId,
    },
  });
  await prisma.$disconnect();
};

main();
