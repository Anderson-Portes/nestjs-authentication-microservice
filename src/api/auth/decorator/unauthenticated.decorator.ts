import { UseGuards, applyDecorators } from '@nestjs/common';
import { UnauthenticatedGuard } from '../guards/unauthenticated.guard';

export const Unauthenticated = () => {
  return applyDecorators(UseGuards(UnauthenticatedGuard));
};
