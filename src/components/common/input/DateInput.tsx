import 'react-day-picker/style.css';

import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  type ChevronProps,
  DayPicker,
  getDefaultClassNames,
} from 'react-day-picker';

import { useClickOutside } from '@/hooks/useClickOutside';

import DefaultInput from './DefaultInput';
import { iconStyle } from './input.styles';
import type { InputProps } from './input.types';

function CustomChevron({ orientation, ...rest }: ChevronProps) {
  return orientation === 'left' ? (
    <ChevronLeftIcon {...rest} className="h-5 w-5 text-fuchsia-500" />
  ) : (
    <ChevronRightIcon {...rest} className="h-5 w-5 text-fuchsia-500" />
  );
}

function formatYYYYMMDD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function DateInput({ label, className, ...rest }: InputProps) {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const defaultClassNames = getDefaultClassNames();
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, setIsFocus);

  useEffect(() => {
    if (typeof rest.value === 'string' && rest.value) {
      const [yy, mm, dd] = rest.value.split('-').map(Number);
      if (yy && mm && dd) setSelectedDate(new Date(yy, mm - 1, dd));
    } else if (!rest.value) {
      setSelectedDate(undefined);
    }
  }, [rest.value]);

  const displayValue = useMemo(() => {
    if (typeof rest.value === 'string') return rest.value;
    return selectedDate ? formatYYYYMMDD(selectedDate) : '';
  }, [rest.value, selectedDate]);

  const handleSelect = (d?: Date) => {
    setSelectedDate(d);
    if (d && rest.onChange) {
      const formatted = formatYYYYMMDD(d);
      rest.onChange({
        target: { name: rest.name, value: formatted },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
      setIsFocus(false);
    }
  };

  return (
    <div ref={ref} className="relative" {...rest}>
      <DefaultInput
        onClick={() => setIsFocus(true)}
        value={displayValue}
        readOnly
        type="text"
        label={label}
        className={className}
        {...rest}
      />
      <CalendarDaysIcon className={iconStyle} />
      {isFocus && (
        <div className="flex w-full justify-center">
          <div className="absolute w-fit">
            <DayPicker
              animate
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              disabled={{ before: new Date() }}
              classNames={{
                today: `text-fuchsia-500`,
                selected: `bg-fuchsia-400 text-white rounded-full`,
                root: `${defaultClassNames.root} shadow-lg p-5 bg-white z-100`,
              }}
              components={{
                Chevron: CustomChevron,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DateInput;
