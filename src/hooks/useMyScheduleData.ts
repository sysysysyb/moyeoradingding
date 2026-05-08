import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getBookmarkSchedules } from '@/api/bookmarkScheduleApi';
import type { BookmarkSchedule, RawScheduleContent } from '@/types/bookmark';
import type {
  GroupInfo,
  GroupSchedule,
  IdolInfo,
  IdolSchedule,
  Schedule,
} from '@/types/schedule';

export function useMyScheduleData() {
  const { data, isLoading, isError, error } = useQuery<
    BookmarkSchedule[],
    Error
  >({
    queryKey: ['mySchedules'],
    queryFn: getBookmarkSchedules,
  });

  const mySchedules: Schedule[] = useMemo(() => {
    const sortedBookmarks = [...(data ?? [])].sort((a, b) =>
      a.schedule_details.start_time.localeCompare(
        b.schedule_details.start_time,
      ),
    );

    return sortedBookmarks.map(bookmark => {
      const scheduleContent: RawScheduleContent = bookmark.schedule_details; // Access schedule_details

      const baseSchedule = {
        id: bookmark.id,
        title: scheduleContent.title,
        startTime: scheduleContent.start_time,
        endTime: scheduleContent.end_time,
        location: scheduleContent.location,
        description: scheduleContent.description,
        isPublic: scheduleContent.is_public,
        isBookmarked: true,
      };

      if (scheduleContent.idol) {
        return {
          ...baseSchedule,
          idol: {
            id: scheduleContent.idol,
            name: scheduleContent.title,
          } as IdolInfo,
        } as IdolSchedule;
      }
      if (scheduleContent.group) {
        return {
          ...baseSchedule,
          group: {
            id: scheduleContent.group,
            name: scheduleContent.title,
          } as GroupInfo,
        } as GroupSchedule;
      }
      return baseSchedule as Schedule;
    });
  }, [data]);

  return {
    mySchedules,
    isLoading,
    isError,
    error,
  };
}
