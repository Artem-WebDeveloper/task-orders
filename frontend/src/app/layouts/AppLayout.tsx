import { NavLink, Outlet, useNavigate } from 'react-router';
import { ClipboardList, LogOut, Users } from 'lucide-react';

import { useAuth } from '@/features/auth/model/context';

import { Button } from '@/shared/ui/button';

const NAV_BY_ROLE = {
  operator: [
    { to: '/operator/orders', label: 'Наряды', icon: ClipboardList },
    { to: '/operator/teams', label: 'Бригады', icon: Users },
  ],
  team: [{ to: '/team/orders', label: 'Мои наряды', icon: ClipboardList }],
} as const;

export function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const navItems = NAV_BY_ROLE[user.role.code];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-svh">
      <aside className="bg-sidebar text-sidebar-foreground flex w-56 shrink-0 flex-col border-r">
        <div className="border-b px-4 py-5">
          <p className="text-lg font-semibold">Task Orders</p>
          <p className="text-muted-foreground text-xs">{user.role.name}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }: { isActive: boolean }) =>
                [
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                ].join(' ')
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start"
          >
            <LogOut className="size-4" />
            Выйти
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-end border-b px-6">
          <p className="text-sm font-medium">{user.fullname}</p>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
