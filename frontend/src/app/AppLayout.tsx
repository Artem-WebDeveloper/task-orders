import { NavLink, Outlet } from "react-router";
import { ClipboardList, LogOut, Users } from "lucide-react";

import { useAuth } from "@/features/auth";
import { useSignOut } from "@/features/auth/hooks/useSignOut";
import { ROLE_HOME } from "./paths";

import { Button } from "@/shared/ui/button";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

const NAV_BY_ROLE = {
  operator: [
    { to: ROLE_HOME.operator, label: "Наряды", icon: ClipboardList },
    { to: "/operator/teams", label: "Бригады", icon: Users },
  ],
  team: [{ to: ROLE_HOME.team, label: "Мои наряды", icon: ClipboardList }],
} as const;

export function AppLayout() {
  const { user } = useAuth();
  const handleSignOut = useSignOut();

  if (!user) return null;

  const navItems = NAV_BY_ROLE[user.role.code];

  return (
    <div className="flex min-h-svh flex-col">
      <header className="bg-background sticky top-0 z-20 flex h-14 items-center justify-between border-b px-4 sm:h-16 sm:px-6">
        <div className="flex items-center gap-3 text-center">
          <div className="border-primary/15 bg-primary/10 grid size-8 place-items-center rounded-xl border shadow-xs sm:size-9">
            <ClipboardList className="text-primary size-4 sm:size-5" />
          </div>
          <p className="text-sm leading-none font-semibold sm:text-base">
            Task Orders
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <div className="border-muted-foreground/50 hidden items-center border-r pr-4 sm:flex">
            <div>
              <p className="text-sm font-medium">{user.fullname}</p>
              <p className="text-muted-foreground text-xs">{user.role.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Выйти</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="bg-sidebar text-sidebar-foreground sticky top-16 hidden h-[calc(100svh-4rem)] w-56 shrink-0 flex-col lg:flex">
          <nav className="flex flex-1 flex-col gap-1 p-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }: { isActive: boolean }) =>
                  [
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  ].join(" ")
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 pb-24 sm:p-6 sm:pb-6">
          <Outlet />
        </main>
      </div>

      <nav className="bg-background fixed inset-x-0 bottom-0 z-20 flex justify-around border-t px-2 py-2 lg:hidden">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }: { isActive: boolean }) =>
              [
                "flex min-w-16 flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              ].join(" ")
            }
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
