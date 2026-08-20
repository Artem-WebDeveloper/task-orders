import { AppDataSource } from '../../data-source.ts';
import { User } from '../../entities/User.ts';

const userRepo = AppDataSource.getRepository(User);

export const allUsers = async () => userRepo.find();
