import { MOCK_IDOLS } from '@/mocks/data/idols';
import type {
  BookmarkSchedule,
  PaginatedResponse,
  RawScheduleContent,
} from '@/types/bookmark';

type MockSchedule = RawScheduleContent;

interface AddMyScheduleBody {
  idol_schedule?: number;
  group_schedule?: number;
}

const MOCK_TODAY = new Date().toISOString().slice(0, 10);

const createSchedule = (
  idolId: number,
  index: number,
  title: string,
  time: string,
  location: string,
): MockSchedule => ({
  id: idolId * 1000 + index,
  title,
  start_time: `${MOCK_TODAY}T${time}:00`,
  end_time: `${MOCK_TODAY}T${String(Number(time.slice(0, 2)) + 1).padStart(
    2,
    '0',
  )}${time.slice(2)}:00`,
  location,
  description: `${title} 데모 일정입니다.`,
  is_public: true,
  created_at: '2026-05-01T00:00:00.000Z',
  updated_at: '2026-05-01T00:00:00.000Z',
  idol: idolId,
});

const MOCK_IDOL_SCHEDULES: MockSchedule[] = MOCK_IDOLS.flatMap(idol => [
  createSchedule(idol.id, 1, `${idol.name} 리허설`, '10:00', '상암 공개홀'),
  createSchedule(idol.id, 2, `${idol.name} 팬미팅`, '14:00', '코엑스 아트홀'),
  createSchedule(
    idol.id,
    3,
    `${idol.name} 라이브 방송`,
    '19:00',
    '딩딩 스튜디오',
  ),
]);

let nextBookmarkId = 500;
let myScheduleBookmarks: BookmarkSchedule[] = [];

const toPaginatedResponse = <T>(results: T[]): PaginatedResponse<T> => ({
  count: results.length,
  next: null,
  previous: null,
  results,
});

const findScheduleById = (scheduleId: number) =>
  MOCK_IDOL_SCHEDULES.find(schedule => schedule.id === scheduleId);

const createBookmarkSchedule = (
  schedule: MockSchedule,
  bookmarkId = nextBookmarkId,
): BookmarkSchedule => {
  nextBookmarkId += 1;

  return {
    id: bookmarkId,
    schedule_type: schedule.idol ? 'idol' : 'group',
    schedule_details: schedule,
  };
};

export const getMockSchedulesByIdolId = (idolId: number) =>
  MOCK_IDOL_SCHEDULES.filter(schedule => schedule.idol === idolId);

export const getMockScheduleBookmarks = () =>
  toPaginatedResponse([...myScheduleBookmarks]);

export const addMockScheduleBookmark = (body: AddMyScheduleBody) => {
  const scheduleId = body.idol_schedule ?? body.group_schedule;
  if (!scheduleId) return null;

  const existingBookmark = myScheduleBookmarks.find(
    bookmark => bookmark.schedule_details.id === scheduleId,
  );
  if (existingBookmark) return existingBookmark;

  const schedule = findScheduleById(scheduleId);
  if (!schedule) return null;

  const bookmark = createBookmarkSchedule(schedule);
  myScheduleBookmarks = [bookmark, ...myScheduleBookmarks];

  return bookmark;
};

export const removeMockScheduleBookmark = (bookmarkId: number) => {
  const beforeLength = myScheduleBookmarks.length;
  myScheduleBookmarks = myScheduleBookmarks.filter(
    bookmark => bookmark.id !== bookmarkId,
  );

  return myScheduleBookmarks.length < beforeLength;
};
