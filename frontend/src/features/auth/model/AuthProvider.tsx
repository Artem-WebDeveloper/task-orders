import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError, tokenStorage } from "@/shared/api/http";
import * as authApi from "../api";

import { AuthContext } from "./context";
import { connectSocket, disconnectSocket } from "@/shared/socket/socketClient";
import { getAuthStatus } from "../lib/getAuthStatus";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => tokenStorage.get());

  const meQuery = useQuery({
    queryKey: ["me", token],
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
    queryFn: async () => {
      try {
        return await authApi.me();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          tokenStorage.clear();
          queryClient.removeQueries({ queryKey: ["me"] });
          setToken(null);
        }
        throw error;
      }
    },
  });

  const status = getAuthStatus(token, meQuery.isPending, meQuery.isError);

  const value = useMemo(
    () => ({
      status,
      user: meQuery.data ?? null,
      signIn(nextToken: string) {
        tokenStorage.set(nextToken);
        setToken(nextToken);
      },
      async signOut() {
        try {
          await authApi.logout();
        } catch (err) {
          console.error(err);
        }
        tokenStorage.clear();
        queryClient.removeQueries({ queryKey: ["me"] });
        setToken(null);
      },
    }),
    [status, queryClient, meQuery.data],
  );

  useEffect(() => {
    if (status === "authenticated" && token) {
      connectSocket(token);
      return () => disconnectSocket();
    }
  }, [status, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
