import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiError, tokenStorage } from '@/api/http';
import * as authApi from '@/api/auth.api';

import { AuthContext } from './context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => tokenStorage.get());

  const meQuery = useQuery({
    queryKey: ['me', token],
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
    queryFn: async () => {
      try {
        return await authApi.me();
      } catch (error) {
        // сессия отозвана на сервере — разлогиниваемся локально
        if (error instanceof ApiError && error.status === 401) {
          tokenStorage.clear();
          queryClient.removeQueries({ queryKey: ['me'] });
          setToken(null);
        }
        throw error;
      }
    },
  });

  const value = useMemo(
    () => ({
      status: (!token
        ? 'unauthenticated'
        : meQuery.isPending
          ? 'loading'
          : meQuery.isError
            ? 'unauthenticated'
            : 'authenticated') as 'loading' | 'authenticated' | 'unauthenticated',
      user: meQuery.data ?? null,
      signIn(nextToken: string) {
        // профиль подтянется автоматически запросом ['me'] по новому токену
        tokenStorage.set(nextToken);
        setToken(nextToken);
      },
      async signOut() {
        try {
          await authApi.logout();
        } catch {
          // сессия могла уже истечь — всё равно чистим локально
        }
        tokenStorage.clear();
        queryClient.removeQueries({ queryKey: ['me'] });
        setToken(null);
      },
    }),
    [token, meQuery.isPending, meQuery.isError, meQuery.data, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
