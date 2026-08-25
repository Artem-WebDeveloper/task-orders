import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { splitDateTimeLocal, joinDateTimeLocal } from "@/features/orders/lib/format";

import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";

interface DateTimeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function DateTimeField({ value, onChange }: DateTimeFieldProps) {
  const { date: datePart, time: timePart } = splitDateTimeLocal(value);
  const selectedDate = datePart ? parseISO(datePart) : undefined;

  return (
    <FormItem>
      <FormLabel>Дата выполнения</FormLabel>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                type="button"
                variant="outline"
                data-empty={!datePart}
                className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal sm:w-[70%]"
              >
                <CalendarIcon />
                {selectedDate
                  ? format(selectedDate, "d MMMM yyyy", { locale: ru })
                  : "Выберите дату"}
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              locale={ru}
              selected={selectedDate}
              onSelect={(day) => onChange(joinDateTimeLocal(day, timePart))}
            />
          </PopoverContent>
        </Popover>
        <Input
          className="w-full sm:flex-1"
          type="time"
          aria-label="Время выполнения"
          value={timePart}
          disabled={!datePart}
          onChange={(e) =>
            onChange(joinDateTimeLocal(selectedDate, e.target.value))
          }
        />
      </div>
      <FormMessage />
    </FormItem>
  );
}
