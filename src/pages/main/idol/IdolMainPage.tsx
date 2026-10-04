import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import Calendar from '@/components/common/calendar/Calendar';
import DateScheduleList from '@/components/common/dateSchedule/DateScheduleList';

import { CalendarScheduleLayout, Greeting } from '../shared';
import { useIdolMainData } from './hooks/useIdolMainData';

export default function IdolMainPage() {
  const { selectedDate, setSelectedDate, allSchedules, dailySchedules } =
    useIdolMainData();

  const navigate = useNavigate();

  const nickname = useMemo(
    () => sessionStorage.getItem('nickname') || '사용자',
    [],
  );

  const handleChatClick = useCallback(() => {
    navigate('/chat');
  }, [navigate]);

  const rightAction = (
    <Button
      onClick={handleChatClick}
      variant="outline"
      shape="pill"
      size="lg"
      className="group mt-6 flex items-center gap-2 border-fuchsia-400 px-6 font-bold whitespace-nowrap text-fuchsia-600 hover:bg-fuchsia-400 hover:text-white lg:ml-6"
    >
      <ChatBubbleLeftRightIcon className="h-5 w-5 text-fuchsia-500 transition-colors group-hover:text-white" />
      그룹 채팅
    </Button>
  );

  return (
    <div className="mx-auto mb-16 max-w-screen-xl px-3 pt-12 md:px-8 lg:mb-24 lg:px-2 lg:pt-6">
      <Greeting
        userRole="idol"
        title={`안녕하세요, ${nickname}님!`}
        subtitle="오늘의 스케줄을 확인해보세요."
        rightAction={rightAction}
      />

      <CalendarScheduleLayout
        dailyMinWidth={420}
        calendar={
          <Calendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            schedules={allSchedules}
          />
        }
        daily={
          <DateScheduleList
            userRole="idol"
            selectedDate={selectedDate.format('YYYY-MM-DD')}
            schedules={dailySchedules}
          />
        }
      />
    </div>
  );
}
