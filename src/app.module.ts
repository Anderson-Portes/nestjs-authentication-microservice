import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/prisma/prisma.module';
import { RolesModule } from './api/admin/roles/roles.module';
import { UsersModule } from './api/admin/users/users.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [PrismaModule, RolesModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
