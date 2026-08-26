export function getAuthStatus(
  token: string | null,
  isPending: boolean,
  isError: boolean,
): "loading" | "authenticated" | "unauthenticated" {
  if (!token) return "unauthenticated";
  if (isPending) return "loading";
  if (isError) return "unauthenticated";
  return "authenticated";
}
