import { Loader2 } from 'lucide-react';

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2">
      <Loader2 className="text-muted-foreground size-6 animate-spin" />
      {label && <p className="text-muted-foreground text-sm">{label}</p>}
    </div>
  );
}
