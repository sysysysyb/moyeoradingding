import { authHandlers } from './handlers/auth';
import { bookmarkHandlers } from './handlers/bookmarks';
import { chatHandlers } from './handlers/chats';
import { idolHandlers } from './handlers/idols';
import { scheduleHandlers } from './handlers/schedules';

export const handlers = [
  ...authHandlers,
  ...bookmarkHandlers,
  ...chatHandlers,
  ...idolHandlers,
  ...scheduleHandlers,
];
