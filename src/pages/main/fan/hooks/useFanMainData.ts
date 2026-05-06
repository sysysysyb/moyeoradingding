import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  addMySchedule,
  getBookmarkSchedules,
  removeMySchedule,
} from '@/api/bookmarkScheduleApi';
import { fetchIdolDetail, fetchIdolSchedules } from '@/api/idolApi';
import { useBookmarkSync } from '@/hooks/useBookmarkSync';
import { toggleFavorite } from '@/mocks/data/idols';
import type { Schedule } from '@/types/schedule';

export function useFanMainData() {
  const { idolId = '' } = useParams<{ idolId: string }>();
  const parsedIdolId = useMemo(() => Number(idolId), [idolId]);

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);

  const { favoriteIdols } = useBookmarkSync();
  const queryClient = useQueryClient();

  const {
    data: idolDetail,
    isLoading: isIdolDetailLoading,
    isError: isIdolDetailError,
  } = useQuery({
    queryKey: ['idol', 'detail', parsedIdolId],
    enabled: Number.isFinite(parsedIdolId) && parsedIdolId > 0,
    queryFn: () => fetchIdolDetail(parsedIdolId),
  });

  const {
    data: idolSchedulesFromApi,
    isLoading: isIdolSchedulesLoading,
    isError: isIdolSchedulesError,
  } = useQuery({
    queryKey: ['idol', 'schedules', parsedIdolId],
    enabled: Number.isFinite(parsedIdolId) && parsedIdolId > 0,
    queryFn: () => fetchIdolSchedules(parsedIdolId),
  });

  const {
    data: rawBookmarkedSchedules,
    isLoading: isBookmarkedSchedulesLoading,
    isError: isBookmarkedSchedulesError,
  } = useQuery({
    queryKey: ['myBookmarkEntries'],
    queryFn: getBookmarkSchedules,
  });

  const bookmarkedScheduleIds = useMemo(() => {
    return new Set(
      rawBookmarkedSchedules?.map(s => s.schedule_details.id) ?? [],
    );
  }, [rawBookmarkedSchedules]);

  const { mutate: toggleScheduleBookmark } = useMutation({
    mutationFn: async (schedule: Schedule) => {
      if (schedule.isBookmarked) {
        const bookmarkEntry = rawBookmarkedSchedules?.find(
          entry => entry.schedule_details.id === schedule.realScheduleId,
        );
        if (bookmarkEntry) {
          await removeMySchedule(bookmarkEntry.id);
        } else {
          throw new Error('Bookmark entry not found for schedule ID');
        }
      } else if ('idol' in schedule && schedule.idol) {
        await addMySchedule({ idol_schedule: schedule.realScheduleId });
      } else if ('group' in schedule && schedule.group) {
        await addMySchedule({ group_schedule: schedule.realScheduleId });
      } else {
        throw new Error('Cannot bookmark schedule without idol or group ID');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['idol', 'schedules', parsedIdolId],
      });
      queryClient.invalidateQueries({ queryKey: ['myBookmarkEntries'] });
    },
  });

  const currentIdol = useMemo(
    () =>
      idolDetail
        ? {
            id: Number(idolDetail.id),
            name: idolDetail.name,
            groupName: idolDetail.groupName ?? '',
          }
        : null,
    [idolDetail],
  );

  const isFavorite = useMemo(
    () =>
      parsedIdolId
        ? favoriteIdols.some(fav => fav.idol === parsedIdolId)
        : false,
    [parsedIdolId, favoriteIdols],
  );

  useEffect(() => {
    if (!currentIdol) {
      setFilteredSchedules([]);
      return;
    }

    const mappedFromApi: Schedule[] = (idolSchedulesFromApi ?? []).map(
      (it: any) => ({
        id: it.id ?? Math.random(),
        title: it.title ?? '',
        startTime: it.start_time ?? it.startTime ?? '',
        endTime: it.end_time ?? it.endTime ?? '',
        description: it.description ?? '',
        isPublic: Boolean(it.is_public ?? it.isPublic ?? true),
        idol: { id: currentIdol.id, name: currentIdol.name },
        location: it.location ?? '',
        isBookmarked: bookmarkedScheduleIds.has(it.id),
        realScheduleId: it.id,
      }),
    ) as Schedule[];

    setFilteredSchedules(mappedFromApi);
  }, [currentIdol, idolSchedulesFromApi, bookmarkedScheduleIds]);

  const handleFavoriteToggle = useCallback(() => {
    if (parsedIdolId) toggleFavorite(parsedIdolId);
  }, [parsedIdolId]);

  return {
    idolId: parsedIdolId,
    selectedDate,
    setSelectedDate,
    filteredSchedules,
    currentIdol,
    isLoading:
      isIdolDetailLoading ||
      isIdolSchedulesLoading ||
      isBookmarkedSchedulesLoading,
    isError:
      isIdolDetailError || isIdolSchedulesError || isBookmarkedSchedulesError,
    isFavorite,
    handleFavoriteToggle,
    toggleScheduleBookmark,
  };
}
