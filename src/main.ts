import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory(errors) {
        const formattedErrors = errors.reduce(
          (errorsObject, currentError) => ({
            ...errorsObject,
            [currentError.property]: Object.values(currentError.constraints)[0],
          }),
          {},
        );
        throw new BadRequestException({ errors: formattedErrors });
      },
    }),
  );
  await app.listen(process.env.APP_PORT);
}
bootstrap();
