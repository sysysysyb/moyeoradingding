import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { IdolSchedule, Schedule } from '@/types/schedule';

type SelectOption = { id: number; label: string };

export function useManagerMainData() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(() => dayjs());

  const idols: SelectOption[] = [
    { id: 201, label: '은하' },
    { id: 202, label: '신비' },
    { id: 203, label: '엄지' },
  ];
  const [currentIdolId, setCurrentIdolId] = useState<number>(idols[0].id);
  const selectedIdolName =
    idols.find(idol => idol.id === currentIdolId)?.label ?? '은하';

  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const iso = selectedDate.format('YYYY-MM-DD');

    const mock: IdolSchedule[] = [
      {
        id: 1,
        title: '뮤직뱅크 리허설',
        startTime: `${iso}T14:00:00`,
        endTime: `${iso}T15:00:00`,
        isPublic: true,
        idol: { id: currentIdolId, name: 'VIVIZ' },
        place: 'KBS 공개홀',
        description: '리허설',
      },
      {
        id: 2,
        title: '뮤직뱅크 사전녹화',
        startTime: `${iso}T16:00:00`,
        endTime: `${iso}T17:00:00`,
        isPublic: true,
        idol: { id: currentIdolId, name: selectedIdolName },
        place: 'KBS 스튜디오',
        description: '사녹',
      },
    ];

    setAllSchedules(mock as Schedule[]);
  }, [selectedDate, currentIdolId, selectedIdolName]);

  const filteredSchedules = useMemo(() => allSchedules, [allSchedules]);

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
      setAllSchedules(prev => [newItem as Schedule, ...prev]);
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
