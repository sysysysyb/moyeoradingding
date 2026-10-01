import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import Calendar from '@/components/common/calendar/Calendar';
import DateScheduleList from '@/components/common/dateSchedule/DateScheduleList';
import Select from '@/components/common/Select';
import { useUserStore } from '@/stores/userStore';

import { CalendarScheduleLayout, Greeting } from '../shared';
import { useManagerMainData } from './hooks/useManagerMainData';
import { useManagerScheduleModals } from './hooks/useManagerScheduleModals';
import DeleteScheduleModal from './modals/DeleteScheduleModal';
import UpsertScheduleModal from './modals/UpsertScheduleModal';

type FormValues = {
  title: string;
  date: string;
  time: string;
  place: string;
  description: string;
  isPublic: boolean;
};

export default function ManagerMainPage() {
  const nickname = useUserStore(state => state.user?.nickname || '매니저');
  const {
    selectedDate,
    setSelectedDate,
    idols,
    currentIdolId,
    setCurrentIdolId,
    filteredSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useManagerMainData();

  const {
    createOpen,
    editOpen,
    deleteOpen,
    targetId,
    targetTitle,
    openCreate,
    closeCreate,
    openEdit,
    closeEdit,
    openDelete,
    closeDelete,
    resetTarget,
  } = useManagerScheduleModals();

  const navigate = useNavigate();

  const handleCreateOpen = useCallback(() => {
    openCreate();
  }, [openCreate]);

  const handleCreateClose = useCallback(() => {
    closeCreate();
    resetTarget();
  }, [closeCreate, resetTarget]);

  const handleEditOpen = useCallback(
    (id: number) => {
      openEdit(id);
    },
    [openEdit],
  );

  const handleEditClose = useCallback(() => {
    closeEdit();
    resetTarget();
  }, [closeEdit, resetTarget]);

  const handleOpenDelete = useCallback(
    (id: number, title?: string) => {
      const safeTitle =
        title ?? filteredSchedules.find(s => s.id === id)?.title ?? '';
      openDelete(id, safeTitle);
    },
    [filteredSchedules, openDelete],
  );

  const handleDeleteClose = useCallback(() => {
    closeDelete();
    resetTarget();
  }, [closeDelete, resetTarget]);

  const handleDeleteConfirm = useCallback(() => {
    if (targetId == null) return;
    deleteSchedule(targetId);
    closeDelete();
    resetTarget();
  }, [closeDelete, deleteSchedule, resetTarget, targetId]);

  const handleCreateSubmit = useCallback(
    (v: FormValues) => {
      const start = `${v.date}T${v.time}`;
      createSchedule({
        title: v.title,
        start,
        place: v.place,
        description: v.description,
        isPublic: v.isPublic,
      });
      closeCreate();
      resetTarget();
    },
    [closeCreate, createSchedule, resetTarget],
  );

  const handleEditSubmit = useCallback(
    (v: FormValues) => {
      if (targetId == null) return;
      const start = `${v.date}T${v.time}`;
      updateSchedule(targetId, {
        title: v.title,
        start,
        place: v.place,
        description: v.description,
        isPublic: v.isPublic,
      });
      closeEdit();
      resetTarget();
    },
    [closeEdit, resetTarget, targetId, updateSchedule],
  );

  const handleChatClick = useCallback(() => {
    navigate('/chat');
  }, [navigate]);

  const editDefaults: Partial<FormValues> | undefined = useMemo(() => {
    if (targetId == null) return undefined;
    const s = filteredSchedules.find(x => x.id === targetId);
    if (!s) return undefined;
    return {
      title: s.title ?? '',
      date: dayjs(s.startTime).format('YYYY-MM-DD'),
      time: dayjs(s.startTime).format('HH:mm'),
      place: s.place ?? '',
      description: s.description ?? '',
      isPublic: s.isPublic,
    };
  }, [filteredSchedules, targetId]);

  const rightAction = (
    <div className="mt-6 flex gap-3 lg:ml-6">
      <Button
        onClick={handleCreateOpen}
        shape="pill"
        size="lg"
        className="inline-flex h-12 w-[185px] items-center justify-center gap-2 bg-fuchsia-100 px-6 font-semibold whitespace-nowrap hover:bg-fuchsia-500 hover:text-white"
      >
        <PlusIcon className="h-6 w-6 flex-shrink-0" />
        일정 등록
      </Button>
      <Button
        onClick={handleChatClick}
        variant="outline"
        shape="pill"
        size="lg"
        className="group inline-flex h-12 w-[185px] items-center justify-center gap-2 border-fuchsia-400 px-6 font-semibold whitespace-nowrap hover:bg-fuchsia-500 hover:text-white"
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6 flex-shrink-0 transition-colors group-hover:text-white" />
        그룹 채팅
      </Button>
    </div>
  );

  return (
    <div className="mx-auto mb-16 max-w-screen-xl px-3 pt-12 md:px-8 lg:mb-24 lg:px-2 lg:pt-6">
      <Greeting
        userRole="manager"
        title={`안녕하세요, ${nickname}님!`}
        subtitle={
          <span className="inline-flex items-center gap-2">
            현재 담당 아이돌은
            <Select
              list={idols}
              value={currentIdolId}
              onChange={v => setCurrentIdolId(Number(v))}
              size="small"
              className="inline-block min-w-[100px] py-2 pr-7 pl-2 text-base leading-tight before:right-2"
            />
            입니다.
          </span>
        }
        rightAction={rightAction}
        subtitleClassName="mt-3 lg:mt-4"
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
            userRole="manager"
            selectedDate={selectedDate.format('YYYY-MM-DD')}
            schedules={filteredSchedules}
            onEditClick={handleEditOpen}
            onDeleteClick={handleOpenDelete}
          />
        }
      />

      {/* 등록 모달 */}
      <UpsertScheduleModal
        open={createOpen}
        mode="create"
        onClose={handleCreateClose}
        initialValues={{ isPublic: false }}
        onSubmit={handleCreateSubmit}
      />

      {/* 수정 모달 */}
      <UpsertScheduleModal
        open={editOpen}
        mode="edit"
        scheduleId={targetId}
        onClose={handleEditClose}
        initialValues={editDefaults}
        onSubmit={handleEditSubmit}
      />

      {/* 삭제 확인 모달 */}
      <DeleteScheduleModal
        open={deleteOpen}
        titleName={targetTitle}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
