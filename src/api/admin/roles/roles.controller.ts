import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ProfileHasAllPermissions } from '../permissions/decorators/profile-has-all-permissions.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ProfileHasAllPermissions('create role')
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }

  @ProfileHasAllPermissions('list roles')
  @Get()
  async findAll() {
    return await this.rolesService.findAll();
  }

  @ProfileHasAllPermissions('show role')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne({ id });
  }

  @ProfileHasAllPermissions('edit role')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.rolesService.update(id, updateRoleDto);
  }

  @ProfileHasAllPermissions('delete role')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.rolesService.remove(id);
  }
}
