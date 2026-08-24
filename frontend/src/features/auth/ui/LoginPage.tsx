import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { LoginUserDto, VerifyCodeDto } from '@task-orders/shared';
import { loginUserSchema, verifyCodeSchema } from '@task-orders/shared';

import { ApiError } from '@/api/http';
import * as authApi from '@/api/auth.api';
import { useAuth } from '@/features/auth/model/context';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

type Step = { kind: 'credentials' } | { kind: 'code'; userId: string };

export function LoginPage() {
  const [step, setStep] = useState<Step>({ kind: 'credentials' });

  return (
    <main className="bg-muted flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {step.kind === 'credentials' ? (
          <CredentialsStep onSuccess={(userId) => setStep({ kind: 'code', userId })} />
        ) : (
          <CodeStep
            userId={step.userId}
            onBack={() => setStep({ kind: 'credentials' })}
          />
        )}
      </div>
    </main>
  );
}

interface CredentialsStepProps {
  onSuccess: (userId: string) => void;
}

function CredentialsStep({ onSuccess }: CredentialsStepProps) {
  const loginMutation = useMutation({
    mutationFn: (dto: LoginUserDto) => authApi.login(dto),
    onSuccess: ({ userId }) => onSuccess(userId),
    onError: (error) => form.setError('root', { message: extractErrorMessage(error) }),
  });

  const form = useForm<LoginUserDto>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: { phone: '', password: '' },
  });

  const onSubmit = form.handleSubmit((values) => loginMutation.mutate(values));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Вход в систему</CardTitle>
        <CardDescription>Укажите телефон и пароль</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="+79991234567" type="tel" autoComplete="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-destructive text-sm">{form.formState.errors.root.message}</p>
            )}
            <Button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Отправляем...' : 'Продолжить'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface CodeStepProps {
  userId: string;
  onBack: () => void;
}

function CodeStep({ userId, onBack }: CodeStepProps) {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const verifyMutation = useMutation({
    mutationFn: (dto: VerifyCodeDto) => authApi.verify2fa(dto),
    onSuccess: ({ token }) => {
      // профиль загрузит AuthProvider запросом ['me'], дальше guards сами разрулят редирект по роли
      signIn(token);
      navigate('/', { replace: true });
    },
    onError: (error) => form.setError('root', { message: extractErrorMessage(error) }),
  });

  const form = useForm<VerifyCodeDto>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { userId, verifyCode: '' },
  });

  const onSubmit = form.handleSubmit((values) => verifyMutation.mutate(values));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Подтверждение входа</CardTitle>
        <CardDescription>
          Введите 6-значный код, отправленный на ваш телефон
          <span className="block text-xs">
            (в dev-режиме код выводится в консоль бэкенда)
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="verifyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Код подтверждения</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000000"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="one-time-code"
                      className="text-center text-lg tracking-[0.5em]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-destructive text-sm">{form.formState.errors.root.message}</p>
            )}
            <Button type="submit" disabled={verifyMutation.isPending}>
              {verifyMutation.isPending ? 'Проверяем...' : 'Войти'}
            </Button>
            <Button type="button" variant="ghost" onClick={onBack}>
              Назад
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-xs">Это имитация двухфакторной авторизации</p>
      </CardFooter>
    </Card>
  );
}

function extractErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return 'Что-то пошло не так. Попробуйте ещё раз';
}
