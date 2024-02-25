import { Controller, Get } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permission } from './entities/permission.entity';
import { ProfileHasAllPermissions } from './decorators/profile-has-all-permissions.decorator';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ProfileHasAllPermissions('list permissions')
  @Get()
  async findAll(): Promise<Permission[]> {
    return await this.permissionsService.findAll();
  }
}
