import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import Calendar from '@/components/common/calendar/Calendar';
import DateScheduleList from '@/components/common/dateSchedule/DateScheduleList';

import { CalendarScheduleLayout, Greeting } from '../shared';
import { useFanMainData } from './hooks/useFanMainData';

export default function FanMainPage() {
  const navigate = useNavigate();
  const {
    selectedDate,
    setSelectedDate,
    filteredSchedules,
    currentIdol,
    isLoading,
    isError,
    isFavorite,
    handleFavoriteToggle,
    toggleScheduleBookmark,
  } = useFanMainData();

  const handleSearchClick = () => navigate('/search');

  const fallbackAction = (
    <Button onClick={handleSearchClick} variant="primary" shape="pill">
      아이돌 검색으로 돌아가기
    </Button>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <div className="text-gray-500">아이돌 정보를 불러오는 중입니다.</div>
        {fallbackAction}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <div>
          <p className="font-semibold text-gray-700">
            아이돌 상세 데모를 준비 중입니다.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            검색 페이지로 돌아가 다른 아이돌을 둘러볼 수 있어요.
          </p>
        </div>
        {fallbackAction}
      </div>
    );
  }

  if (!currentIdol) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <div className="text-gray-500">아이돌 정보를 찾을 수 없습니다.</div>
        {fallbackAction}
      </div>
    );
  }

  const leftIcon = (
    <button
      type="button"
      onClick={handleFavoriteToggle}
      aria-label={isFavorite ? '찜 해제' : '찜 추가'}
      className="transition-transform hover:scale-110"
    >
      {isFavorite ? (
        <HeartSolid className="h-10 w-10 fill-fuchsia-500 lg:h-12 lg:w-12" />
      ) : (
        <HeartOutline className="h-10 w-10 text-fuchsia-500 lg:h-12 lg:w-12" />
      )}
    </button>
  );

  const rightAction = (
    <Button
      onClick={handleSearchClick}
      variant="primary"
      shape="pill"
      size="lg"
      className="mt-6 shrink-0 px-6 whitespace-nowrap lg:ml-6"
    >
      아이돌 검색하기
    </Button>
  );

  return (
    <div className="mx-auto mb-16 max-w-screen-xl px-3 pt-12 md:px-8 lg:mb-24 lg:px-2 lg:pt-6">
      <Greeting
        userRole="fan"
        title={`${currentIdol.name}의 일정을\n확인해보세요`}
        leftIcon={leftIcon}
        leftIconClassName="self-start mt-1"
        rightAction={rightAction}
      />
      <CalendarScheduleLayout
        dailyMinWidth={420}
        calendar={
          <Calendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            schedules={filteredSchedules}
          />
        }
        daily={
          <DateScheduleList
            userRole="fan"
            selectedDate={selectedDate.format('YYYY-MM-DD')}
            schedules={filteredSchedules}
            toggleScheduleBookmark={toggleScheduleBookmark}
          />
        }
      />
    </div>
  );
}
