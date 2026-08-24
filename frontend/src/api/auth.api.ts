import type { LoginUserDto, VerifyCodeDto } from '@task-orders/shared';

import { requestData, request } from './http';
import type { ApiUser } from './types';

export async function login(dto: LoginUserDto): Promise<{ userId: string }> {
  return requestData<{ userId: string }>('auth/login', { method: 'POST', body: dto });
}

export async function verify2fa(dto: VerifyCodeDto): Promise<{ token: string }> {
  const envelope = await request<{ token: string; message?: string }>('auth/verify-2fa', {
    method: 'POST',
    body: dto,
  });
  return { token: envelope.token };
}

export async function logout(): Promise<void> {
  await request<void>('auth/logout', { method: 'POST' });
}

export async function me(): Promise<ApiUser> {
  const data = await requestData<{ user: ApiUser }>('auth/me');
  return data.user;
}
