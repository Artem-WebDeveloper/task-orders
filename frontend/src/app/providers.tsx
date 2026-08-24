import { QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '@/features/auth/model/AuthProvider';
import { queryClient } from './query-client';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
