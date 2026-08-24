import { cn } from "@/shared/lib/utils";

export function StepDots({ active }: { active: 0 | 1 }) {
  return (
    <div className="flex gap-1.5" aria-label={`Шаг ${active + 1} из 2`}>
      {[0, 1].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1 w-6 rounded-full transition-colors",
            i === active ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}

export function MessageSlot({ children }: { children?: React.ReactNode }) {
  return <p>{children}</p>;
}
