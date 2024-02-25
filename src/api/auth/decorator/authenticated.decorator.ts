import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthenticatedGuard } from '../guards/authenticated.guard';

export const Authenticated = () => {
  return applyDecorators(UseGuards(AuthenticatedGuard));
};
