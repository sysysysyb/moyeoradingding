import { http, HttpResponse } from 'msw';

import { API_BASE_URL } from '@/api/config';
import {
  createMockAccessToken,
  createMockRefreshToken,
  DEMO_AUTH_USERS,
  getDemoUserById,
  getUserIdFromAccessToken,
  updateDemoUserProfile,
} from '@/mocks/data/auth';

interface LoginRequestBody {
  email: string;
  password: string;
  userType?: string;
}

interface SignUpRequestBody {
  email: string;
  nickname: string;
}

const getBearerToken = (request: Request) => {
  const authHeader =
    request.headers.get('Authorization') ??
    request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) return null;

  return authHeader.slice('Bearer '.length);
};

export const authHandlers = [
  http.post(`${API_BASE_URL}/users/signup/`, async ({ request }) => {
    const formData = await request.formData();
    const body: SignUpRequestBody = {
      email: String(formData.get('email') ?? ''),
      nickname: String(formData.get('nickname') ?? ''),
    };

    return HttpResponse.json(
      {
        message_code: 201,
        message: '회원가입이 성공적으로 완료되었습니다.',
        data: {
          user_id: 'demo-signup-user',
          ...body,
          userType: 'NORMAL',
          profile_image_url: 'default-profile.jpg',
        },
      },
      { status: 201 },
    );
  }),

  http.post(`${API_BASE_URL}/users/login/`, async ({ request }) => {
    const { email, password, userType } =
      (await request.json()) as LoginRequestBody;
    const user = DEMO_AUTH_USERS.find(
      account =>
        account.email === email &&
        account.password === password &&
        account.role === userType,
    );

    if (!user) {
      return HttpResponse.json(
        { message: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      access_token: createMockAccessToken(user.id),
      refresh_token: createMockRefreshToken(user.id),
    });
  }),

  http.get(`${API_BASE_URL}/users/mypage/`, ({ request }) => {
    const token = getBearerToken(request);
    const userId = token ? getUserIdFromAccessToken(token) : null;

    const user = getDemoUserById(userId);
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profile_image_url: user.profile_image_url,
      role: user.role,
    });
  }),

  http.patch(`${API_BASE_URL}/users/mypage/`, async ({ request }) => {
    const token = getBearerToken(request);
    const userId = token ? getUserIdFromAccessToken(token) : null;

    const user = getDemoUserById(userId);
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const nicknameValue = formData.get('nickname');
    const nickname =
      typeof nicknameValue === 'string' ? nicknameValue.trim() : undefined;

    const updatedProfile = updateDemoUserProfile(user, {
      nickname: nickname || undefined,
      profile_image_url: user.profile_image_url,
    });

    return HttpResponse.json({
      message: '프로필이 성공적으로 업데이트되었습니다!',
      updated_profile: updatedProfile,
    });
  }),

  http.post(`${API_BASE_URL}/users/password/verify/`, async ({ request }) => {
    const token = getBearerToken(request);
    const user = getDemoUserById(
      token ? getUserIdFromAccessToken(token) : null,
    );
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { current_password: currentPassword } = (await request.json()) as {
      current_password?: string;
    };

    if (currentPassword !== user.password) {
      return HttpResponse.json(
        { message: '비밀번호가 일치하지 않습니다.' },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      message: '현재 비밀번호가 확인되었습니다.',
    });
  }),

  http.patch(`${API_BASE_URL}/users/password/change/`, async ({ request }) => {
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

  http.post(`${API_BASE_URL}/users/logout/`, () => {
    return HttpResponse.json({ message: '로그아웃되었습니다.' });
  }),
];
