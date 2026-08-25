import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/shared/lib/theme";
import { Button } from "@/shared/ui/button";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
      onClick={toggle}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
