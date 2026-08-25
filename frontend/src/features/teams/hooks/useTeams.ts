import { useQuery } from "@tanstack/react-query";

import { listTeams, teamsQueryKey } from "../api";

export function useTeams(enabled = true) {
  return useQuery({
    queryKey: teamsQueryKey,
    queryFn: listTeams,
    enabled,
  });
}
