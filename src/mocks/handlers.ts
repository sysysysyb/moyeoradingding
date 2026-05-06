import { http, HttpResponse } from 'msw';

import { ALL_SCHEDULES } from './data';
import { authHandlers } from './handlers/auth';
// import { CHAT_EXAMPLES } from './data/chats';

// const CHATS_BY_ROOM = {
//   'chat-001': CHAT_EXAMPLES,
// };

interface SignUpRequestBody {
  email: string;
  nickname: string;
  password: string;
  userType: string;
}

interface SignInRequestBody {
  email: string;
  password: string;
}

const users: {
  user_id: string;
  email: string;
  nickname: string;
  password: string;
  userType: string;
  profile_image_url: string;
}[] = [
  {
    user_id: 'aownotn3f',
    email: 'test@test.com',
    nickname: 'test',
    password: 'test123!',
    userType: 'NORMAL',
    profile_image_url: 'default-profile.jpg',
  },
];

export const handlers = [
  ...authHandlers,

  http.get('/bookmark/idol', () => {
    return HttpResponse.json([
      {
        id: 1,
        name: '카리나',
        group: '에스파',
        position: '리더, 댄서',
      },
      {
        id: 2,
        name: '장원영',
        group: '아이브',
        position: '보컬',
      },
      {
        id: 3,
        name: '민지',
        group: '뉴진스',
        position: '보컬, 댄서',
      },
      {
        id: 4,
        name: '사쿠라',
        group: '르세라핌',
        position: '보컬',
      },
    ]);
  }),

  http.get('/schedules/my', ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    if (!date) {
      return HttpResponse.json(ALL_SCHEDULES); // 날짜가 없으면 모든 스케줄 반환
    }

    const schedulesForDate = ALL_SCHEDULES.filter(schedule =>
      schedule.startTime.startsWith(date),
    );
    return HttpResponse.json(schedulesForDate);
  }),

  http.post('/api/v1/users/signup/', async ({ request }) => {
    // console.log('MSW: Received sign-up request');
    let requestBody: SignUpRequestBody;
    try {
      requestBody = (await request.json()) as SignUpRequestBody;
      // console.log('MSW: Request body parsed:', requestBody);
    } catch (e) {
      // console.error('MSW: Error parsing request body:', e);
      return HttpResponse.json(
        { message: '잘못된 요청 바디입니다.' },
        { status: 400 },
      );
    }

    const { email, nickname, password } = requestBody;

    if (users.find(user => user.email === email)) {
      // console.log('MSW: Email already exists:', email);
      return HttpResponse.json(
        {
          message_code: 400,
          message: '이미 가입한 이메일 주소입니다.',
          data: null,
        },
        { status: 400 },
      );
    }

    const user = {
      user_id: Math.random().toString(36).substring(2, 10),
      email,
      nickname,
      password,
      userType: 'NORMAL',
      profile_image_url: 'default-profile.jpg',
    };

    users.push(user);
    // console.log('MSW: User registered:', user);
    // console.log('MSW: Current users array:', users);

    return HttpResponse.json(
      {
        message_code: 201,
        message: '회원가입이 성공적으로 완료되었습니다.',
        data: user,
      },
      { status: 201 },
    );
  }),

  http.post('/users/login', async ({ request }) => {
    const { email, password } = (await request.json()) as SignInRequestBody;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return HttpResponse.json(
        {
          message_code: 401,
          message: '이메일 또는 비밀번호가 일치하지 않습니다.',
          data: null,
        },
        { status: 401 },
      );
    }

    // Generate mock tokens
    const mockAccessToken = `mock_access_token_for_${user.user_id}`;
    const mockRefreshToken = `mock_refresh_token_for_${user.user_id}`;

    return HttpResponse.json(
      {
        user_id: user.user_id,
        access_token: mockAccessToken,
        refresh_token: mockRefreshToken,
        profile_image_url: user.profile_image_url,
        role: user.userType,
      },
      { status: 200 },
    );
  }),

  // http.get(`*/chats/rooms/:room_pk/messages/`, ({ request, params }) => {
  //   const auth =
  //     request.headers.get('Authorization') ??
  //     request.headers.get('authorization');
  // const token = auth?.slice(7);

  //   if (!token) {
  //     return HttpResponse.json({ message: '인증 실패' }, { status: 401 });
  //   }

  //   const roomPk = params.room_pk;

  //   const messages = CHATS_BY_ROOM[roomPk] ?? [];

  //   const sortedData = [...messages].sort(
  //     (a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime(),
  //   );

  //   return HttpResponse.json(sortedData);
  // }),

  http.get('/users/mypage', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const userId = token.replace('mock_access_token_for_', '');

    const user = users.find(u => u.user_id === userId);

    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return HttpResponse.json({
      id: user.user_id,
      email: user.email,
      nickname: user.nickname,
      profile_image_url: user.profile_image_url,
      role: user.userType,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }),

  http.patch('/users/mypage', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const userId = token.replace('mock_access_token_for_', '');

    const userIndex = users.findIndex(u => u.user_id === userId);

    if (userIndex === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { nickname } = (await request.json()) as { nickname: string };

    // Update user's nickname
    users[userIndex].nickname = nickname;

    const updatedUser = users[userIndex];

    return HttpResponse.json(
      {
        message: '프로필이 성공적으로 업데이트되었습니다!',
        data: {
          nickname: updatedUser.nickname,
          profile_image_url: updatedUser.profile_image_url,
        },
      },
      { status: 200 },
    );
  }),
];
