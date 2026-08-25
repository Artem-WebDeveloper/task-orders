import { useQuery } from "@tanstack/react-query";

import { listTeams, teamsQueryKey } from "../api";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

export function TeamsList() {
  const teamsQuery = useQuery({
    queryKey: teamsQueryKey,
    queryFn: listTeams,
  });

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Бригады</h1>

      {teamsQuery.isPending && (
        <p className="text-muted-foreground text-sm">Загрузка бригад...</p>
      )}
      {teamsQuery.error instanceof Error && (
        <p className="text-destructive text-sm">{teamsQuery.error.message}</p>
      )}

      {teamsQuery.data && (
        <>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Телефон</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamsQuery.data.map((team) => (
                <TableRow key={team.uuid}>
                  <TableCell className="font-medium">{team.fullname}</TableCell>
                  <TableCell>{team.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {teamsQuery.data.length === 0 && (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <p className="font-medium">Бригад пока нет</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Пользователи с ролью «бригада» появятся здесь после регистрации
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
