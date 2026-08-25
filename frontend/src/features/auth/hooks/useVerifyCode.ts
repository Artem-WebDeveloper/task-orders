import { useMutation } from "@tanstack/react-query";
import type { VerifyCodeDto } from "@task-orders/shared";

import * as authApi from "../api";
import { useAuth } from "../model/context";

export function useVerifyCode() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: async (dto: VerifyCodeDto) => {
      const { token } = await authApi.verify2fa(dto);
      signIn(token);
    },
  });
}
