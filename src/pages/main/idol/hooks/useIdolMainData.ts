import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { fetchIdolSchedules } from '@/api/scheduleApi';
import type { Schedule } from '@/types/schedule';

export function useIdolMainData() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(() => dayjs());
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const schedules = await fetchIdolSchedules();
        setAllSchedules(schedules);
      } catch {
        setAllSchedules([]);
      }
    };
    load();
  }, []);

  const monthlySchedules = useMemo(
    () =>
      allSchedules.filter(s =>
        dayjs(s.startTime).isSame(selectedDate, 'month'),
      ),
    [allSchedules, selectedDate],
  );

  const dailySchedules = useMemo(
    () =>
      allSchedules.filter(s => dayjs(s.startTime).isSame(selectedDate, 'day')),
    [allSchedules, selectedDate],
  );

  return { selectedDate, setSelectedDate, monthlySchedules, dailySchedules };
}
