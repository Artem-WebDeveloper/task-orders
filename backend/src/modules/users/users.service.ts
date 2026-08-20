import { AppDataSource } from '../../data-source.ts';
import { User } from '../../entities/User.ts';

const userRepo = AppDataSource.getRepository(User);

export const allUsers = async () => await userRepo.find();

export const allTeams = async () => await userRepo.find({ where: { role: { code: 'team' } } });
