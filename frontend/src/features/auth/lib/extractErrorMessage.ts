import { ApiError } from "@/shared/api/http";

export function extractErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "Что-то пошло не так. Попробуйте ещё раз";
}
