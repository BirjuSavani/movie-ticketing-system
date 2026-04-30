import { DataSource } from 'typeorm';
import { env } from './env';

const isTest = env.NODE_ENV === 'test';

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: isTest ? env.TEST_DB_NAME : env.DB_NAME,
  synchronize: false,
  logging: env.NODE_ENV === "development",
  entities: [__dirname + "/../entities/*.{js,ts}"],
  migrations: [__dirname + "/../migrations/*.{js,ts}"],
  subscribers: [],
});
