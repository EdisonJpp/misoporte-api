import { Module } from "@nestjs/common";
import { DatabaseModule } from "./config/database/database.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: [".env"],
    }),
    UsersModule,
  ],
})
export class AppModule {
  static port: number;
  static apiVersion: string;
  static apiPrefix: string;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = +this.configService.get("API_PORT");
    AppModule.apiVersion = this.configService.get("API_VERSION");
    AppModule.apiPrefix = this.configService.get("API_PREFIX");
  }
}
