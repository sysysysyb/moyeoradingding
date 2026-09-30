import { http, HttpResponse } from 'msw';

import { API_BASE_URL } from '@/api/config';
import {
  addMockScheduleBookmark,
  getMockIdolSchedules,
  getMockScheduleBookmarks,
  removeMockScheduleBookmark,
} from '@/mocks/data/schedules';

export const scheduleHandlers = [
  http.get(`${API_BASE_URL}/schedules/idols/`, ({ request }) => {
    const url = new URL(request.url);
    const idolParam = url.searchParams.get('idol');
    const idolId = idolParam ? Number(idolParam) : undefined;
    const dateISO = url.searchParams.get('date') ?? undefined;

    return HttpResponse.json(getMockIdolSchedules(idolId, dateISO));
  }),

  http.get(`${API_BASE_URL}/idols/:idolId/schedules/`, ({ params }) => {
    const idolId = Number(params.idolId);
    return HttpResponse.json(getMockIdolSchedules(idolId));
  }),

  http.get(`${API_BASE_URL}/schedules/my/`, () => {
    return HttpResponse.json(getMockScheduleBookmarks());
  }),

  http.post(`${API_BASE_URL}/schedules/my/`, async ({ request }) => {
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

  http.delete(`${API_BASE_URL}/schedules/my/:bookmarkId/`, ({ params }) => {
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
