import { NavLink, Outlet, useNavigate } from "react-router";
import { ClipboardList, LogOut, Users } from "lucide-react";

import { useAuth } from "@/features/auth";
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const navItems = NAV_BY_ROLE[user.role.code];

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-3 text-center">
          <div className="border-primary/15 bg-primary/10 grid size-9 place-items-center rounded-xl border shadow-xs">
            <ClipboardList className="text-primary size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-base leading-none font-semibold">Task Orders</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="border-muted-foreground/50 border-r pr-4">
            <p className="text-sm font-medium">{user.fullname}</p>
            <p className="text-muted-foreground text-xs">{user.role.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="size-4" />
            Выйти
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="bg-sidebar text-sidebar-foreground sticky top-16 flex h-[calc(100svh-4rem)] w-56 shrink-0 flex-col">
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

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
