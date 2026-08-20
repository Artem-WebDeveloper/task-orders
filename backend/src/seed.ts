import 'reflect-metadata';
import bcrypt from 'bcryptjs';

import { AppDataSource } from './data-source.ts';
import { User } from './entities/User.ts';
import { Role } from './entities/Role.ts';

async function clearTables() {
  await AppDataSource.query(`
    TRUNCATE TABLE "roles", "users", "orders" 
    RESTART IDENTITY CASCADE
    `);
  console.log('Tables cleared');
}

async function seedData() {
  await AppDataSource.transaction(async (manager) => {
    const roleRepo = manager.getRepository(Role);
    const userRepo = manager.getRepository(User);

    const operatorRole = roleRepo.create({ name: 'Оператор', code: 'operator' });
    const teamRole = roleRepo.create({ name: 'Бригада', code: 'team' });

    await roleRepo.save([operatorRole, teamRole]);
    console.log('Roles added into DB');

    const passwordHash = await bcrypt.hash('123456', 10);

    const operator = userRepo.create({
      fullname: 'Иван Операторов',
      passwordHash,
      phone: '89880000001',
      role: operatorRole,
    });
    const team = userRepo.create({
      fullname: 'Бригада Монтажников 1',
      passwordHash,
      phone: '89880000002',
      role: teamRole,
    });
    await userRepo.save([operator, team]);
    console.log('Users added into DB');
  });
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

main();
