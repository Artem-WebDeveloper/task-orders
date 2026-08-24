import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  createOrderSchema,
  ORDER_STATUSES,
  type OrderStatus,
} from '@task-orders/shared';

import { listTeams, teamsQueryKey } from '@/features/teams';
import type { ApiOrder } from '@/shared/api/types';
import { toDatetimeLocalValue, ORDER_STATUS_LABELS } from '../lib/format';
import { useCreateOrder, useUpdateOrder } from '../hooks/useOrders';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

/** Поля формы; executionAt остаётся строкой datetime-local — бэкенд сам коэрсит её в Date. */
const orderFormSchema = z.object({
  assignee: z.uuid({ message: 'Некорректный исполнитель' }).or(z.literal('')),
  executionAt: z.string().min(1, 'Укажите дату выполнения'),
  address: createOrderSchema.shape.address,
  description: createOrderSchema.shape.description,
  status: createOrderSchema.shape.status,
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

const NO_ASSIGNEE = '';

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Наряд для редактирования; без него — режим создания. */
  order?: ApiOrder | null;
}

export function OrderFormDialog({ open, onOpenChange, order }: OrderFormDialogProps) {
  const isEdit = !!order;

  const teamsQuery = useQuery({
    queryKey: teamsQueryKey,
    queryFn: listTeams,
    enabled: open,
  });

  const defaultValues = useMemo<OrderFormValues>(
    () => ({
      assignee: order?.assignee?.uuid ?? NO_ASSIGNEE,
      executionAt: order ? toDatetimeLocalValue(order.executionAt) : '',
      address: order?.address ?? '',
      description: order?.description ?? '',
      status: order?.status ?? 'new',
    }),
    [order],
  );

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues,
  });

  // при открытии модалки (и смене редактируемого наряда) сбрасываем форму
  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open, defaultValues, form]);

  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder(order?.uuid ?? '');
  const mutation = isEdit ? updateMutation : createMutation;

  const onSubmit = form.handleSubmit(async (values) => {
    const dto = {
      assignee: values.assignee === NO_ASSIGNEE ? null : values.assignee,
      executionAt: new Date(values.executionAt),
      address: values.address,
      description: values.description,
      status: values.status,
    };

    try {
      await mutation.mutateAsync(dto);
      onOpenChange(false);
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Не удалось сохранить наряд',
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Редактирование наряда' : 'Новый наряд'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Измените данные и сохраните наряд'
              : 'Заполните данные и при необходимости назначьте бригаду'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="executionAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата выполнения</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес</FormLabel>
                  <FormControl>
                    <Input placeholder="ул. Ленина, д. 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Например: "Замена счётчика"' rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Исполнитель</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Не назначен" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NO_ASSIGNEE}>Не назначен</SelectItem>
                        {(teamsQuery.data ?? []).map((team) => (
                          <SelectItem key={team.uuid} value={team.uuid}>
                            {team.fullname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус</FormLabel>
                    <Select
                      onValueChange={(value: string) => field.onChange(value as OrderStatus)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {ORDER_STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.formState.errors.root && (
              <p className="text-destructive text-sm">{form.formState.errors.root.message}</p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Сохраняем...' : 'Сохранить'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
