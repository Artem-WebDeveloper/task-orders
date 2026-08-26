import { DataSource } from 'typeorm';
import { Role } from './entities/Role.ts';
import { User } from './entities/User.ts';
import { Order } from './entities/Order.ts';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'task_orders',
  synchronize: true,
  logging: false,
  entities: [Role, User, Order],
  subscribers: [],
  migrations: [],
});
