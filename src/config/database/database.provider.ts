import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

/**
 * Setup default connection in the application
 * @param config {ConfigService}
 */
const defaultConnection = (config: ConfigService): TypeOrmModuleOptions => ({
  type: "postgres",
  host: "localhost",  //config.get("POSTGRES_HOST"),
  port: 5432,  //config.get("POSTGRES_PORT"),
  username: 'postgres', //config.get("POSTGRES_USERNAME"),
  password: 'admin', // config.get("POSTGRES_PASSWORD") + "",
  database: "misoporte_db", // config.get("POSTGRES_DATABASE"),
  autoLoadEntities: config.get("POSTGRES_AUTOLOAD") == "true",
  synchronize: config.get("POSTGRES_SYNCHRONIZE") == "true",
  logging: config.get("POSTGRES_LOGGING") == "true",
});

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: defaultConnection,
    inject: [ConfigService],
  }),
];
