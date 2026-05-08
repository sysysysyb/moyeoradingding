import { http, HttpResponse } from 'msw';

import {
  createMockAccessToken,
  createMockRefreshToken,
  DEMO_AUTH_USER,
  getUserIdFromAccessToken,
  updateDemoUserProfile,
} from '@/mocks/data/auth';

interface LoginRequestBody {
  email: string;
  password: string;
}

const getBearerToken = (request: Request) => {
  const authHeader =
    request.headers.get('Authorization') ??
    request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) return null;

  return authHeader.slice('Bearer '.length);
};

export const authHandlers = [
  http.post('*/users/login/', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequestBody;

    if (
      email !== DEMO_AUTH_USER.email ||
      password !== DEMO_AUTH_USER.password
    ) {
      return HttpResponse.json(
        { message: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      access_token: createMockAccessToken(DEMO_AUTH_USER.id),
      refresh_token: createMockRefreshToken(DEMO_AUTH_USER.id),
    });
  }),

  http.get('*/users/mypage/', ({ request }) => {
    const token = getBearerToken(request);
    const userId = token ? getUserIdFromAccessToken(token) : null;

    if (userId !== DEMO_AUTH_USER.id) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({
      id: DEMO_AUTH_USER.id,
      email: DEMO_AUTH_USER.email,
      nickname: DEMO_AUTH_USER.nickname,
      profile_image_url: DEMO_AUTH_USER.profile_image_url,
      role: DEMO_AUTH_USER.role,
    });
  }),

  http.patch('*/users/mypage/', async ({ request }) => {
    const token = getBearerToken(request);
    const userId = token ? getUserIdFromAccessToken(token) : null;

    if (userId !== DEMO_AUTH_USER.id) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const nicknameValue = formData.get('nickname');
    const nickname =
      typeof nicknameValue === 'string' ? nicknameValue.trim() : undefined;

    const updatedProfile = updateDemoUserProfile({
      nickname: nickname || undefined,
      profile_image_url: DEMO_AUTH_USER.profile_image_url,
    });

    return HttpResponse.json({
      message: '프로필이 성공적으로 업데이트되었습니다!',
      updated_profile: updatedProfile,
    });
  }),

  http.post('*/users/password/verify/', async ({ request }) => {
    const { current_password: currentPassword } = (await request.json()) as {
      current_password?: string;
    };

    if (currentPassword !== DEMO_AUTH_USER.password) {
      return HttpResponse.json(
        { message: '비밀번호가 일치하지 않습니다.' },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      message: '현재 비밀번호가 확인되었습니다.',
    });
  }),

  http.patch('*/users/password/change/', async ({ request }) => {
    const {
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    } = (await request.json()) as {
      new_password?: string;
      confirm_new_password?: string;
    };

    if (!newPassword || newPassword !== confirmNewPassword) {
      return HttpResponse.json(
        { message: '새 비밀번호가 일치하지 않습니다.' },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      message: '비밀번호가 성공적으로 변경되었습니다.',
    });
  }),

  http.post('*/users/logout/', () => {
    return HttpResponse.json({ message: '로그아웃되었습니다.' });
  }),
];
