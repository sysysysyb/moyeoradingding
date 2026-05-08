import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

import { addMySchedule, removeMySchedule } from '@/api/bookmarkScheduleApi';
import Calendar from '@/components/common/calendar/Calendar';
import DateScheduleList from '@/components/common/dateSchedule/DateScheduleList';
import { useMyScheduleData } from '@/hooks/useMyScheduleData';
import type { Schedule } from '@/types/schedule';

export default function MySchedule() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [viewDate, setViewDate] = useState(dayjs());

  const { mySchedules, isLoading, isError } = useMyScheduleData();
  const queryClient = useQueryClient();

  const { mutate: toggleScheduleBookmark } = useMutation({
    mutationFn: async (schedule: Schedule) => {
      if (schedule.isBookmarked) {
        await removeMySchedule(schedule.id);
      } else if ('idol' in schedule && schedule.idol) {
        await addMySchedule({ idol_schedule: schedule.idol.id });
      } else if ('group' in schedule && schedule.group) {
        await addMySchedule({ group_schedule: schedule.group.id });
      } else {
        throw new Error('Cannot bookmark schedule without idol or group ID');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySchedules'] });
    },
  });

  const monthlySchedules = useMemo(() => {
    return mySchedules.filter(schedule =>
      dayjs(schedule.startTime).isSame(viewDate, 'month'),
    );
  }, [mySchedules, viewDate]);

  const dailySchedules = useMemo(() => {
    return mySchedules.filter(schedule =>
      dayjs(schedule.startTime).isSame(selectedDate, 'day'),
    );
  }, [mySchedules, selectedDate]);

  const getFirstScheduleDateInMonth = useCallback(
    (date: Dayjs) => {
      const firstSchedule = mySchedules.find(schedule =>
        dayjs(schedule.startTime).isSame(date, 'month'),
      );

      return firstSchedule
        ? dayjs(firstSchedule.startTime).startOf('day')
        : date.startOf('month');
    },
    [mySchedules],
  );

  const handleCalendarDateChange = (date: Dayjs) => {
    setSelectedDate(date);
    if (!date.isSame(viewDate, 'month')) {
      setViewDate(date);
    }
  };

  const handleCalendarMonthChange = (date: Dayjs) => {
    setViewDate(date);
    setSelectedDate(getFirstScheduleDateInMonth(date));
  };

  if (isLoading) {
    return <div>내 스케줄을 불러오는 중...</div>;
  }

  if (isError) {
    return <div>내 스케줄을 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <h3 className="mb-10 hidden py-4 text-center text-3xl md:block">
        즐겨찾기한 일정
      </h3>
      <Calendar
        selectedDate={selectedDate}
        onDateChange={handleCalendarDateChange}
        onViewDateChange={handleCalendarMonthChange}
        schedules={monthlySchedules}
      />
      <DateScheduleList
        userRole="favorites"
        selectedDate={selectedDate.format('YYYY-MM-DD')}
        schedules={dailySchedules}
        toggleScheduleBookmark={toggleScheduleBookmark}
        className="mt-6"
      />
    </>
  );
}
