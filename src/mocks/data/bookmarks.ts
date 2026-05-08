import { MOCK_IDOLS } from '@/mocks/data/idols';
import type {
  BookmarkGroup,
  BookmarkIdol,
  PaginatedResponse,
} from '@/types/bookmark';

const MOCK_USER_ID = '1';

let nextBookmarkId = 100;

const createBookmarkedAt = () => new Date().toISOString();

const findIdolById = (idolId: number) =>
  MOCK_IDOLS.find(idol => idol.id === idolId);

const createBookmarkIdol = (
  idolId: number,
  bookmarkId = nextBookmarkId,
): BookmarkIdol | null => {
  const idol = findIdolById(idolId);
  if (!idol) return null;

  nextBookmarkId += 1;

  return {
    id: bookmarkId,
    user: MOCK_USER_ID,
    idol: idol.id,
    idol_name: idol.name,
    created_at: createBookmarkedAt(),
  };
};

const initialBookmarkIds = MOCK_IDOLS.slice(0, 3).map(idol => idol.id);

let idolBookmarks: BookmarkIdol[] = initialBookmarkIds
  .map(idolId => createBookmarkIdol(idolId))
  .filter((bookmark): bookmark is BookmarkIdol => Boolean(bookmark));

const toPaginatedResponse = <T>(results: T[]): PaginatedResponse<T> => ({
  count: results.length,
  next: null,
  previous: null,
  results,
});

export const getMockBookmarkIdols = () =>
  toPaginatedResponse([...idolBookmarks]);

export const getMockBookmarkGroups = () =>
  toPaginatedResponse<BookmarkGroup>([]);

export const addMockBookmarkIdol = (idolId: number) => {
  const existingBookmark = idolBookmarks.find(
    bookmark => bookmark.idol === idolId,
  );

  if (existingBookmark) return existingBookmark;

  const bookmark = createBookmarkIdol(idolId);
  if (!bookmark) return null;

  idolBookmarks = [bookmark, ...idolBookmarks];
  return bookmark;
};

export const removeMockBookmarkIdol = (bookmarkId: number) => {
  const beforeLength = idolBookmarks.length;
  idolBookmarks = idolBookmarks.filter(bookmark => bookmark.id !== bookmarkId);

  return idolBookmarks.length < beforeLength;
};
