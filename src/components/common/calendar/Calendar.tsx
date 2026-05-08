import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import type { Schedule } from '@/types/schedule';

import CalendarDate from './CalendarDate';
import CalendarToolbar from './CalendarToolbar';
import CalendarWeekDays from './CalendarWeekDays';

interface CalendarProps {
  selectedDate: Dayjs;
  onDateChange: (date: Dayjs) => void;
  onViewDateChange?: (date: Dayjs) => void;
  schedules: Schedule[];
}

function Calendar({
  selectedDate,
  onDateChange,
  onViewDateChange,
  schedules,
}: CalendarProps) {
  const [viewDate, setViewDate] = useState(selectedDate);

  const viewDates = useMemo(() => {
    const firstDateOfMonth = viewDate.startOf('month');
    const startDay = firstDateOfMonth.startOf('week');
    const lastDateOfMonth = viewDate.endOf('month');
    const endDay = lastDateOfMonth.endOf('week');

    const dates: Dayjs[] = [];
    let day = startDay;

    while (day.isBefore(endDay) || day.isSame(endDay, 'day')) {
      dates.push(day);
      day = day.add(1, 'day');
    }

    return dates;
  }, [viewDate]);

  const schedulesByDate = useMemo(() => {
    const map = new Map<string, Schedule[]>();
    schedules.forEach(schedule => {
      const date = schedule.startTime.split('T')[0]; // YYYY-MM-DD
      if (!map.has(date)) {
        map.set(date, []);
      }
      map.get(date)?.push(schedule);
    });
    return map;
  }, [schedules]);

  const handleMovePrevMonth = () => {
    setViewDate(prev => {
      const next = prev.add(-1, 'month');
      onViewDateChange?.(next.startOf('month'));
      return next;
    });
  };

  const handleMoveNextMonth = () => {
    setViewDate(prev => {
      const next = prev.add(1, 'month');
      onViewDateChange?.(next.startOf('month'));
      return next;
    });
  };

  const handleMoveCurrentMonth = () => {
    const today = dayjs().startOf('day');
    setViewDate(today);
    onDateChange(today);
  };

  const handleClickDate = (date: Dayjs) => {
    const clickedDate = date.startOf('day');
    onDateChange(clickedDate);

    if (!date.isSame(viewDate, 'month')) {
      setViewDate(clickedDate);
    }
  };

  // *memo - 선택한 날짜 값 넘기는 로직 작성할 때 수정 후 사용
  useEffect(() => {
    // console.log(selectedDate);
  }, [selectedDate]);

  return (
    <div className="h-fit w-full rounded-2xl border border-gray-200 p-1 shadow-md">
      <CalendarToolbar
        year={viewDate.year()}
        month={viewDate.month() + 1}
        handleMovePrevMonth={handleMovePrevMonth}
        handleMoveNextMonth={handleMoveNextMonth}
        handleMoveCurrentMonth={handleMoveCurrentMonth}
      />
      <div className="grid grid-cols-7">
        <CalendarWeekDays />
        {viewDates.map(date => (
          <CalendarDate
            key={date.format('YYYY-MM-DD')}
            date={date}
            viewDate={viewDate}
            selectedDate={selectedDate}
            handleClickDate={handleClickDate}
            schedulesForDate={
              schedulesByDate.get(date.format('YYYY-MM-DD')) || []
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Calendar;
