import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { RolesModule } from './api/admin/roles/roles.module';

@Module({
  imports: [PrismaModule, RolesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
