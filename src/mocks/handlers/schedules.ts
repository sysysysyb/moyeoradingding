import { http, HttpResponse } from 'msw';

import {
  addMockScheduleBookmark,
  getMockScheduleBookmarks,
  getMockSchedulesByIdolId,
  removeMockScheduleBookmark,
} from '@/mocks/data/schedules';

export const scheduleHandlers = [
  http.get('*/idols/:idolId/schedules/', ({ params }) => {
    const idolId = Number(params.idolId);
    return HttpResponse.json(getMockSchedulesByIdolId(idolId));
  }),

  http.get('*/schedules/my/', () => {
    return HttpResponse.json(getMockScheduleBookmarks());
  }),

  http.post('*/schedules/my/', async ({ request }) => {
    const body = (await request.json()) as {
      idol_schedule?: number;
      group_schedule?: number;
    };
    const bookmark = addMockScheduleBookmark(body);

    if (!bookmark) {
      return HttpResponse.json(
        { message: '스케줄을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return HttpResponse.json(bookmark, { status: 201 });
  }),

  http.delete('*/schedules/my/:bookmarkId/', ({ params }) => {
    const bookmarkId = Number(params.bookmarkId);
    const removed = removeMockScheduleBookmark(bookmarkId);

    if (!removed) {
      return HttpResponse.json(
        { message: '북마크한 스케줄을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
