import { http, HttpResponse } from 'msw';

import {
  addMockBookmarkIdol,
  getMockBookmarkGroups,
  getMockBookmarkIdols,
  removeMockBookmarkIdol,
} from '@/mocks/data/bookmarks';

interface AddBookmarkIdolRequestBody {
  idol: number;
}

export const bookmarkHandlers = [
  http.get('*/bookmarks/idols/', () => {
    return HttpResponse.json(getMockBookmarkIdols());
  }),

  http.get('*/bookmarks/groups/', () => {
    return HttpResponse.json(getMockBookmarkGroups());
  }),

  http.post('*/bookmarks/idols/', async ({ request }) => {
    const { idol } = (await request.json()) as AddBookmarkIdolRequestBody;
    const bookmark = addMockBookmarkIdol(Number(idol));

    if (!bookmark) {
      return HttpResponse.json(
        { message: '아이돌을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return HttpResponse.json(bookmark, { status: 201 });
  }),

  http.delete('*/bookmarks/idols/:bookmarkId/', ({ params }) => {
    const bookmarkId = Number(params.bookmarkId);
    const removed = removeMockBookmarkIdol(bookmarkId);

    if (!removed) {
      return HttpResponse.json(
        { message: '북마크를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
