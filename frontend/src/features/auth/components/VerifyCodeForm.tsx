import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Info, Loader2 } from 'lucide-react';
import type { VerifyCodeDto } from '@task-orders/shared';
import { verifyCodeSchema } from '@task-orders/shared';

import * as authApi from '../api';
import { useAuth } from '../model/context';
import { extractErrorMessage } from '../lib/extractErrorMessage';
import { MessageSlot, StepDots } from './Parts';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';

interface VerifyCodeFormProps {
  userId: string;
  onBack: () => void;
}

export function VerifyCodeForm({ userId, onBack }: VerifyCodeFormProps) {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const verifyMutation = useMutation({
    mutationFn: async (dto: VerifyCodeDto) => {
      const { token } = await authApi.verify2fa(dto);
      signIn(token);
    },
    // Профиль подтянется в AuthProvider по новому токену,
    // а «/» редиректнет на домашний раздел по роли.
    onSuccess: () => {
      navigate('/', { replace: true });
    },
    onError: (error) =>
      form.setError('root', { message: extractErrorMessage(error) }),
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
        </CardDescription>
        <CardAction>
          <StepDots active={1} />
        </CardAction>
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
                    <InputOTP
                      maxLength={6}
                      autoFocus
                      disabled={verifyMutation.isPending}
                      value={field.value}
                      onChange={field.onChange}
                      containerClassName="justify-center pt-1 pb-1"
                    >
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <MessageSlot>
                    <FormMessage />
                  </MessageSlot>
                </FormItem>
              )}
            />
            <MessageSlot>
              {form.formState.errors.root && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.root.message}
                </p>
              )}
            </MessageSlot>
            <div className="flex items-start gap-2 rounded-lg bg-blue-500/10 px-3 py-2.5 text-xs text-blue-600 dark:text-blue-300">
              <Info className="mt-px size-3.5 shrink-0" />
              <span>
                В dev-режиме код подтверждения выводится в консоль бэкенда
              </span>
            </div>
            <Button type="submit" disabled={verifyMutation.isPending}>
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Проверяем...
                </>
              ) : (
                'Войти'
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              disabled={verifyMutation.isPending}
            >
              <ArrowLeft />
              Назад
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
