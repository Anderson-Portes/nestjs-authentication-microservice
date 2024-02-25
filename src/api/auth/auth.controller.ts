import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Unauthenticated } from './decorator/unauthenticated.decorator';
import { Authenticated } from './decorator/authenticated.decorator';
import { LoginDto } from './dto/login.dto';
import { ProfileDto } from './dto/profile.dto';
import { Profile } from './decorator/profile.decorator';
import { User } from '../admin/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Unauthenticated()
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return await this.authService.login(loginDto);
  }

  @Unauthenticated()
  @Post('/register')
  async register(@Body() profileDto: ProfileDto) {
    return await this.authService.register(profileDto);
  }

  @Authenticated()
  @Get('/profile')
  async getProfile(@Profile() profile: User) {
    return profile;
  }

  @Authenticated()
  @Patch('/profile')
  async updateProfile(
    @Profile() profile: User,
    @Body() profileDto: ProfileDto,
  ) {
    return await this.authService.updateProfile(profile, profileDto);
  }
}
