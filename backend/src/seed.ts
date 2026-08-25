import 'reflect-metadata';
import bcrypt from 'bcryptjs';

import { AppDataSource } from './data-source.ts';
import { User } from './entities/User.ts';
import { Role } from './entities/Role.ts';
import { Order } from './entities/Order.ts';

async function clearTables() {
  await AppDataSource.query(`
    TRUNCATE TABLE "orders", "users", "roles"
    RESTART IDENTITY CASCADE
  `);
  console.log('Tables cleared');
}

async function seedData() {
  await AppDataSource.transaction(async (manager) => {
    const roleRepo = manager.getRepository(Role);
    const userRepo = manager.getRepository(User);
    const orderRepo = manager.getRepository(Order);

    const operatorRole = roleRepo.create({ name: 'Оператор', code: 'operator' });
    const teamRole = roleRepo.create({ name: 'Бригада', code: 'team' });
    await roleRepo.save([operatorRole, teamRole]);
    console.log('Roles seeded');

    const passwordHash = await bcrypt.hash('123456', 10);

    const operator1 = userRepo.create({
      fullname: 'Иван Операторов',
      passwordHash,
      phone: '89880000001',
      role: operatorRole,
    });
    const operator2 = userRepo.create({
      fullname: 'Мария Диспетчерова',
      passwordHash,
      phone: '89880000003',
      role: operatorRole,
    });
    const team1 = userRepo.create({
      fullname: 'Бригада Монтажников',
      passwordHash,
      phone: '89880000002',
      role: teamRole,
    });
    const team2 = userRepo.create({
      fullname: 'Бригада Электриков',
      passwordHash,
      phone: '89880000004',
      role: teamRole,
    });
    const team3 = userRepo.create({
      fullname: 'Бригада Сантехников',
      passwordHash,
      phone: '89880000005',
      role: teamRole,
    });
    await userRepo.save([operator1, operator2, team1, team2, team3]);
    console.log('Users seeded');

    const orders = [
      orderRepo.create({
        executionAt: new Date('2026-08-28T10:00:00+03:00'),
        address: 'ул. Ленина, д. 5',
        description: 'Замена электропроводки в подъезде',
        status: 'new',
        assignee: team2,
      }),
      orderRepo.create({
        executionAt: new Date('2026-08-28T14:00:00+03:00'),
        address: 'ул. Пушкина, д. 12',
        description: 'Установка счётчика воды',
        status: 'new',
        assignee: null,
      }),
      orderRepo.create({
        executionAt: new Date('2026-08-27T09:00:00+03:00'),
        address: 'пр. Мира, д. 3',
        description: 'Ремонт входной двери',
        status: 'in_progress',
        assignee: team1,
      }),
      orderRepo.create({
        executionAt: new Date('2026-08-27T11:30:00+03:00'),
        address: 'ул. Гагарина, д. 8',
        description: 'Прочистка канализации',
        status: 'in_progress',
        assignee: team3,
      }),
      orderRepo.create({
        executionAt: new Date('2026-08-26T08:00:00+03:00'),
        address: 'ул. Чехова, д. 15',
        description: 'Покраска забора',
        status: 'done',
        assignee: team1,
      }),
      orderRepo.create({
        executionAt: new Date('2026-08-26T13:00:00+03:00'),
        address: 'пер. Садовый, д. 2',
        description: 'Замена ламп в коридоре',
        status: 'done',
        assignee: team2,
      }),
      orderRepo.create({
        executionAt: new Date('2026-08-29T10:00:00+03:00'),
        address: 'ул. Толстого, д. 7',
        description: 'Установка кондиционера',
        status: 'new',
        assignee: team1,
      }),
      orderRepo.create({
        executionAt: new Date('2026-08-27T15:00:00+03:00'),
        address: 'пр. Победы, д. 20',
        description: 'Замена смесителя в ванной',
        status: 'in_progress',
        assignee: team2,
      }),
    ];

    await orderRepo.save(orders);
    console.log('Orders seeded');
  });
}

export async function seedIfEmpty() {
  const roleRepo = AppDataSource.getRepository(Role);
  const count = await roleRepo.count();
  if (count === 0) {
    console.log('Database is empty, seeding...');
    await seedData();
  }
}

async function main() {
  const deleteOnly = process.argv[2] === '--delete';

  try {
    await AppDataSource.initialize();
  } catch (err) {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  }

  try {
    if (deleteOnly) {
      await clearTables();
    } else {
      await clearTables();
      await seedData();
    }
    console.log('Done!');
  } catch (err) {
    console.error('Failed: ', err);
    process.exitCode = 1;
  } finally {
    await AppDataSource.destroy();
    process.exit();
  }
}

if (process.argv[1]?.endsWith('seed.ts')) {
  main();
}
