import { authHandlers } from './handlers/auth';
import { bookmarkHandlers } from './handlers/bookmarks';
import { idolHandlers } from './handlers/idols';
import { scheduleHandlers } from './handlers/schedules';

export const handlers = [
  ...authHandlers,
  ...bookmarkHandlers,
  ...idolHandlers,
  ...scheduleHandlers,
];
