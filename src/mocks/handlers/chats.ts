import { http, HttpResponse } from 'msw';

import { API_BASE_URL } from '@/api/config';
import { getDemoUserById, getUserIdFromAccessToken } from '@/mocks/data/auth';
import {
  addMockChatMessage,
  CHAT_FIXTURE_VERSION,
  CHAT_ROOM_ID,
  getMockChatMessages,
} from '@/mocks/data/chats';

const getUser = (request: Request) => {
  const token = request.headers.get('Authorization')?.replace(/^Bearer /, '');
  return getDemoUserById(token ? getUserIdFromAccessToken(token) : null);
};

const isDemoChatRoom = (roomId: string | readonly string[] | undefined) =>
  Number(roomId) === CHAT_ROOM_ID;

export const chatHandlers = [
  http.get(`${API_BASE_URL}/chats/rooms/`, ({ request }) => {
    if (!getUser(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json({
      count: 1,
      next: null,
      previous: null,
      results: [{ id: CHAT_ROOM_ID, room_name: '데모 그룹 채팅' }],
    });
  }),

  http.get(
    `${API_BASE_URL}/chats/rooms/:roomId/participants/`,
    ({ request, params }) => {
      if (!getUser(request)) {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      if (!isDemoChatRoom(params.roomId)) {
        return HttpResponse.json(
          { message: '채팅방을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }
      return HttpResponse.json({
        count: 3,
        next: null,
        previous: null,
        results: [1, 2, 3].map(id => {
          const user = getDemoUserById(id)!;
          return { id: user.id, nickname: user.nickname, profile_image: 0 };
        }),
      });
    },
  ),

  http.get(
    `${API_BASE_URL}/chats/rooms/:roomId/messages/`,
    ({ request, params }) => {
      if (!getUser(request)) {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      if (!isDemoChatRoom(params.roomId)) {
        return HttpResponse.json(
          { message: '채팅방을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page') || 1);
      if (!Number.isInteger(page) || page < 1) {
        return HttpResponse.json(
          { message: '잘못된 페이지입니다.' },
          { status: 400 },
        );
      }
      const messages = getMockChatMessages();
      const pageSize = 10;
      const end = Math.max(messages.length - (page - 1) * pageSize, 0);
      const start = Math.max(end - pageSize, 0);
      url.searchParams.set('page', String(page + 1));

      return HttpResponse.json(
        {
          count: messages.length,
          next: start > 0 ? url.toString() : null,
          previous: null,
          results: messages.slice(start, end),
        },
        { headers: { 'X-Demo-Fixture-Version': CHAT_FIXTURE_VERSION } },
      );
    },
  ),

  http.post(
    `${API_BASE_URL}/chats/rooms/:roomId/messages/`,
    async ({ request, params }) => {
      const user = getUser(request);
      if (!user) {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      if (!isDemoChatRoom(params.roomId)) {
        return HttpResponse.json(
          { message: '채팅방을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const body = (await request.json()) as { content?: unknown };
      const content =
        typeof body.content === 'string' ? body.content.trim() : '';
      if (!content || content.length > 1000) {
        return HttpResponse.json(
          { message: '메시지는 1자 이상 1000자 이하로 입력해주세요.' },
          { status: 400 },
        );
      }
      return HttpResponse.json(addMockChatMessage(user.id, content), {
        status: 201,
      });
    },
  ),
];
