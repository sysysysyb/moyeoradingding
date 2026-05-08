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

const createSchedule = (
  idolId: number,
  index: number,
  dateISO: string,
  title: string,
  time: string,
  location: string,
  description: string,
): MockSchedule => ({
  id: idolId * 1000 + index,
  title,
  start_time: `${dateISO}T${time}:00`,
  end_time: `${dateISO}T${String(Number(time.slice(0, 2)) + 1).padStart(
    2,
    '0',
  )}${time.slice(2)}:00`,
  location,
  description,
  is_public: true,
  created_at: '2026-05-01T00:00:00.000Z',
  updated_at: '2026-05-01T00:00:00.000Z',
  idol: idolId,
});

const scheduleTemplates = [
  {
    monthOffset: -1,
    day: 5,
    title: '월간 리허설',
    time: '10:00',
    location: '상암 공개홀',
    description: '지난달 공개 방송 리허설 일정입니다.',
  },
  {
    monthOffset: -1,
    day: 12,
    title: '팬 사인회',
    time: '14:00',
    location: '홍대 팝업홀',
    description: '앨범 발매 기념 팬 사인회입니다.',
  },
  {
    monthOffset: -1,
    day: 12,
    title: '미니 토크',
    time: '17:00',
    location: '홍대 팝업홀',
    description: '팬 사인회 이후 진행되는 짧은 토크입니다.',
  },
  {
    monthOffset: -1,
    day: 21,
    title: '라디오 출연',
    time: '11:30',
    location: 'MBC 라디오 스튜디오',
    description: '정오 라디오 게스트 출연입니다.',
  },
  {
    monthOffset: -1,
    day: 26,
    title: '안무 연습 공개',
    time: '19:00',
    location: '딩딩 연습실',
    description: '신곡 안무 일부 공개 일정입니다.',
  },
  {
    monthOffset: 0,
    day: 4,
    title: '콘텐츠 촬영',
    time: '09:30',
    location: '성수 스튜디오',
    description: '공식 채널용 콘텐츠 촬영입니다.',
  },
  {
    monthOffset: 0,
    day: 11,
    title: '음악방송 리허설',
    time: '10:00',
    location: 'KBS 공개홀',
    description: '음악방송 무대 리허설입니다.',
  },
  {
    monthOffset: 0,
    day: 11,
    title: '음악방송 생방송',
    time: '18:00',
    location: 'KBS 공개홀',
    description: '음악방송 생방송 출연입니다.',
  },
  {
    monthOffset: 0,
    day: 18,
    title: '팬미팅',
    time: '15:00',
    location: '코엑스 아트홀',
    description: '월간 팬미팅 일정입니다.',
  },
  {
    monthOffset: 0,
    day: 24,
    title: '라이브 방송',
    time: '20:00',
    location: '딩딩 스튜디오',
    description: '팬들과 함께하는 라이브 방송입니다.',
  },
  {
    monthOffset: 1,
    day: 3,
    title: '화보 촬영',
    time: '08:30',
    location: '파주 세트장',
    description: '매거진 화보 촬영 일정입니다.',
  },
  {
    monthOffset: 1,
    day: 10,
    title: '쇼케이스 리허설',
    time: '13:00',
    location: '잠실 실내체육관',
    description: '쇼케이스 무대 리허설입니다.',
  },
  {
    monthOffset: 1,
    day: 10,
    title: '쇼케이스',
    time: '19:00',
    location: '잠실 실내체육관',
    description: '신규 무대 쇼케이스입니다.',
  },
  {
    monthOffset: 1,
    day: 18,
    title: '공개 방송',
    time: '16:00',
    location: 'SBS 프리즘타워',
    description: '팬 입장이 가능한 공개 방송입니다.',
  },
  {
    monthOffset: 1,
    day: 25,
    title: '팬클럽 이벤트',
    time: '14:00',
    location: '블루스퀘어',
    description: '공식 팬클럽 대상 이벤트입니다.',
  },
] as const;

const MOCK_IDOL_SCHEDULES: MockSchedule[] = MOCK_IDOLS.flatMap(idol =>
  scheduleTemplates.map((template, index) =>
    createSchedule(
      idol.id,
      index + 1,
      getRelativeMonthDate(template.monthOffset, template.day),
      `${idol.name} ${template.title}`,
      template.time,
      template.location,
      template.description,
    ),
  ),
);

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
