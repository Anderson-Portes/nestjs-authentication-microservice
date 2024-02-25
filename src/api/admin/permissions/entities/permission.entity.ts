import { Prisma } from '.prisma/client';

export class Permission implements Prisma.PermissionUncheckedCreateInput {
  id?: string;
  name: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  RolePermission?: Prisma.RolePermissionUncheckedCreateNestedManyWithoutPermissionInput;
}
