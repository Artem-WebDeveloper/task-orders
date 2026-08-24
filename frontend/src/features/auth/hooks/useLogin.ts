import { useMutation } from "@tanstack/react-query";
import type { LoginUserDto } from "@task-orders/shared";

import * as authApi from "../api";

export function useLogin() {
  return useMutation({ mutationFn: (dto: LoginUserDto) => authApi.login(dto) });
}
