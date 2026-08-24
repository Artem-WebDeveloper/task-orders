import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { LoginUserDto } from "@task-orders/shared";
import { loginUserSchema } from "@task-orders/shared";

import { useLogin } from "../hooks/useLogin";
import { extractErrorMessage } from "../lib/extractErrorMessage";
import { MessageSlot, StepDots } from "./Parts";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";

interface LoginFormProps {
  onSuccess: (userId: string) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin();

  const form = useForm<LoginUserDto>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: { phone: "", password: "" },
  });

  const onSubmit = form.handleSubmit((values) =>
    login.mutate(values, {
      onSuccess: ({ userId }) => onSuccess(userId),
      onError: (error) =>
        form.setError("root", { message: extractErrorMessage(error) }),
    }),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Вход в систему</CardTitle>
        <CardDescription>Укажите телефон и пароль</CardDescription>
        <CardAction>
          <StepDots active={0} />
        </CardAction>
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
                    <Input
                      placeholder="+79991234567"
                      type="tel"
                      autoComplete="tel"
                      {...field}
                    />
                  </FormControl>
                  <MessageSlot>
                    <FormMessage />
                  </MessageSlot>
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
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className="pr-9"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        tabIndex={-1}
                        aria-label={
                          showPassword ? "Скрыть пароль" : "Показать пароль"
                        }
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-1 right-1 flex items-center"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
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
            <Button type="submit" disabled={login.isPending}>
              {login.isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Отправляем...
                </>
              ) : (
                "Продолжить"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
