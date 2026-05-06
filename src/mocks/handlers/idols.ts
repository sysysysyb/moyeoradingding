import { http, HttpResponse } from 'msw';

import type { Idol } from '@/mocks/data/idols';
import { MOCK_IDOLS } from '@/mocks/data/idols';
import type { DRFPage } from '@/types/idol';

const PAGE_SIZE = 24;

type IdolListItemResponse = {
  id: number;
  name: string;
  user: number;
  group: number | null;
  group_name: string;
  position: Idol['position'];
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

const toIdolListItemResponse = (idol: Idol): IdolListItemResponse => ({
  id: idol.id,
  name: idol.name,
  user: idol.id,
  group: null,
  group_name: idol.groupName,
  position: idol.position,
  avatar_url: idol.avatarUrl,
  created_at: '2025-08-01T00:00:00.000Z',
  updated_at: '2025-08-01T00:00:00.000Z',
});

const getPaginationUrl = (
  requestUrl: URL,
  page: number,
  totalPages: number,
) => {
  if (page < 1 || page > totalPages) return null;

  const url = new URL(requestUrl);
  url.searchParams.set('page', String(page));
  return url.toString();
};

export const idolHandlers = [
  http.get('*/idols/', ({ request }) => {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('search')?.trim().toLowerCase();
    const page = Number(url.searchParams.get('page') ?? '1');
    const currentPage = Number.isFinite(page) && page > 0 ? page : 1;

    const filteredIdols = searchQuery
      ? MOCK_IDOLS.filter(idol => {
          const name = idol.name.toLowerCase();
          const groupName = idol.groupName.toLowerCase();
          return name.includes(searchQuery) || groupName.includes(searchQuery);
        })
      : MOCK_IDOLS;

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const totalPages = Math.ceil(filteredIdols.length / PAGE_SIZE);
    const results = filteredIdols.slice(start, end).map(toIdolListItemResponse);

    const response: DRFPage<IdolListItemResponse> = {
      count: filteredIdols.length,
      next: getPaginationUrl(url, currentPage + 1, totalPages),
      previous: getPaginationUrl(url, currentPage - 1, totalPages),
      results,
    };

    return HttpResponse.json(response);
  }),
];
