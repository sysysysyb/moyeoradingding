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

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRelativeMonthDate = (monthOffset: number, day: number) => {
  const today = new Date();
  return formatDate(
    new Date(today.getFullYear(), today.getMonth() + monthOffset, day),
  );
};

const getCurrentDate = () => formatDate(new Date());

const SCHEDULE_DATES = {
  previousMonth: getRelativeMonthDate(-1, 12),
  currentMonth: getCurrentDate(),
  nextMonth: getRelativeMonthDate(1, 18),
};

const createSchedule = (
  idolId: number,
  index: number,
  dateISO: string,
  title: string,
  time: string,
  location: string,
): MockSchedule => ({
  id: idolId * 1000 + index,
  title,
  start_time: `${dateISO}T${time}:00`,
  end_time: `${dateISO}T${String(Number(time.slice(0, 2)) + 1).padStart(
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
  createSchedule(
    idol.id,
    1,
    SCHEDULE_DATES.previousMonth,
    `${idol.name} 월간 리허설`,
    '11:00',
    '상암 공개홀',
  ),
  createSchedule(
    idol.id,
    2,
    SCHEDULE_DATES.previousMonth,
    `${idol.name} 팬 사인회`,
    '16:00',
    '홍대 팝업홀',
  ),
  createSchedule(
    idol.id,
    3,
    SCHEDULE_DATES.currentMonth,
    `${idol.name} 리허설`,
    '10:00',
    '상암 공개홀',
  ),
  createSchedule(
    idol.id,
    4,
    SCHEDULE_DATES.currentMonth,
    `${idol.name} 팬미팅`,
    '14:00',
    '코엑스 아트홀',
  ),
  createSchedule(
    idol.id,
    5,
    SCHEDULE_DATES.currentMonth,
    `${idol.name} 라이브 방송`,
    '19:00',
    '딩딩 스튜디오',
  ),
  createSchedule(
    idol.id,
    6,
    SCHEDULE_DATES.nextMonth,
    `${idol.name} 쇼케이스`,
    '13:00',
    '잠실 실내체육관',
  ),
  createSchedule(
    idol.id,
    7,
    SCHEDULE_DATES.nextMonth,
    `${idol.name} 공개 방송`,
    '18:00',
    'KBS 공개홀',
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
