import { useState } from 'react';
import { ClipboardList } from 'lucide-react';

import { LoginForm } from './LoginForm';
import { VerifyCodeForm } from './VerifyCodeForm';

import { cn } from '@/shared/lib/utils';

type Step = { kind: 'credentials' } | { kind: 'code'; userId: string };
type Direction = 'forward' | 'back';

export function LoginPage() {
  const [step, setStep] = useState<Step>({ kind: 'credentials' });
  const [direction, setDirection] = useState<Direction>('forward');

  return (
    <main className="bg-background flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="border-primary/15 bg-primary/10 grid size-12 place-items-center rounded-2xl border shadow-sm">
            <ClipboardList className="text-primary size-6" />
          </div>
          <div className="space-y-1">
            <p className="text-lg leading-none font-semibold">Task Orders</p>
            <p className="text-muted-foreground text-sm">
              Система нарядов на выезд
            </p>
          </div>
        </div>

        <div
          key={step.kind}
          className={cn(
            'animate-in fade-in duration-300',
            direction === 'forward'
              ? 'slide-in-from-right-8'
              : 'slide-in-from-left-8',
          )}
        >
          {step.kind === 'credentials' ? (
            <LoginForm
              onSuccess={(userId) => {
                setDirection('forward');
                setStep({ kind: 'code', userId });
              }}
            />
          ) : (
            <VerifyCodeForm
              userId={step.userId}
              onBack={() => {
                setDirection('back');
                setStep({ kind: 'credentials' });
              }}
            />
          )}
        </div>
        {step.kind === 'code' && (
          <p className="text-muted-foreground mt-6 text-center text-xs">
            Демонстрационная имитация двухфакторной авторизации
          </p>
        )}
      </div>
    </main>
  );
}
