import { requestData } from '@/shared/api/http';
import type { ApiUser } from '@/shared/api/types';

export const teamsQueryKey = ['users', 'teams'] as const;

/** Список пользователей с ролью «бригада» (только оператор). */
export async function listTeams(): Promise<ApiUser[]> {
  const data = await requestData<{ teams: ApiUser[] }>('users/teams');
  return data.teams;
}
