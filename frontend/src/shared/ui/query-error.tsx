import { ApiError } from "@/shared/api/http";

interface QueryErrorProps {
  error: unknown;
}

export function QueryError({ error }: QueryErrorProps) {
  if (error instanceof ApiError && error.status === 401) {
    return (
      <p className="text-destructive text-sm">
        Сессия истекла. Обновите страницу.
      </p>
    );
  }

  if (error instanceof ApiError) {
    return <p className="text-destructive text-sm">{error.message}</p>;
  }

  return null;
}
