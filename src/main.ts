import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix(AppModule.apiPrefix);
  await app.listen(AppModule.port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
