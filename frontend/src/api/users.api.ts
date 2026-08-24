import { requestData } from './http';
import type { ApiUser } from './types';

/** Список всех пользователей (только оператор). */
export async function listUsers(): Promise<ApiUser[]> {
  const data = await requestData<{ users: ApiUser[] }>('users');
  return data.users;
}

/** Список пользователей с ролью «бригада» (только оператор). */
export async function listTeams(): Promise<ApiUser[]> {
  const data = await requestData<{ teams: ApiUser[] }>('users/teams');
  return data.teams;
}
