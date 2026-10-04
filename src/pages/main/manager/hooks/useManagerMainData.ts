import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

import {
  createMockManagerSchedules,
  MOCK_MANAGER_IDOLS,
} from '@/mocks/data/schedules';
import type { IdolSchedule } from '@/types/schedule';

export function useManagerMainData() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(() => dayjs());

  const idols = MOCK_MANAGER_IDOLS;
  const [currentIdolId, setCurrentIdolId] = useState<number>(idols[0].id);
  const selectedIdolName =
    idols.find(idol => idol.id === currentIdolId)?.label ?? '은하';

  const [allSchedules, setAllSchedules] = useState<IdolSchedule[]>(
    createMockManagerSchedules,
  );

  const filteredSchedules = useMemo(
    () => allSchedules.filter(schedule => schedule.idol.id === currentIdolId),
    [allSchedules, currentIdolId],
  );

  const createSchedule = useCallback(
    (draft: {
      title: string;
      start: string; // 'YYYY-MM-DDTHH:mm'
      place?: string;
      description?: string;
      isPublic: boolean;
    }) => {
      const newItem: IdolSchedule = {
        id: Date.now(),
        title: draft.title,
        startTime: draft.start,
        endTime: draft.start, // TODO: 종료시간 정책 반영
        place: draft.place ?? '',
        description: draft.description ?? '',
        isPublic: draft.isPublic,
        idol: { id: currentIdolId, name: selectedIdolName },
      };
      setAllSchedules(prev => [newItem, ...prev]);
    },
    [currentIdolId, selectedIdolName],
  );

  const updateSchedule = useCallback(
    (
      id: number,
      patch: {
        title?: string;
        start?: string;
        place?: string;
        description?: string;
        isPublic?: boolean;
      },
    ) => {
      setAllSchedules(prev =>
        prev.map(s =>
          s.id === id
            ? {
                ...s,
                title: patch.title ?? s.title,
                startTime: patch.start ?? s.startTime,
                endTime: patch.start ?? s.endTime,
                place: patch.place ?? s.place,
                description: patch.description ?? s.description,
                isPublic: patch.isPublic ?? s.isPublic,
              }
            : s,
        ),
      );
    },
    [],
  );

  const deleteSchedule = useCallback((id: number) => {
    setAllSchedules(prev => prev.filter(s => s.id !== id));
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    idols,
    currentIdolId,
    setCurrentIdolId,
    filteredSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
}
