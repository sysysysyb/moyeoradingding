export type MockUserRole = 'NORMAL' | 'MANAGER' | 'IDOL' | 'ADMIN';

export interface MockUser {
  id: number;
  email: string;
  nickname: string;
  password: string;
  role: MockUserRole;
  profile_image_url: string;
}

export const DEMO_AUTH_USERS: MockUser[] = [
  {
    id: 1,
    email: 'test@test.com',
    nickname: '데모 팬',
    password: 'test123!',
    role: 'NORMAL',
    profile_image_url: 'default-profile.jpg',
  },
  {
    id: 2,
    email: 'idol@test.com',
    nickname: '리즈',
    password: 'test123!',
    role: 'IDOL',
    profile_image_url: 'default-profile.jpg',
  },
  {
    id: 3,
    email: 'manager@test.com',
    nickname: '데모 매니저',
    password: 'test123!',
    role: 'MANAGER',
    profile_image_url: 'default-profile.jpg',
  },
];

export const getDemoUserById = (userId: number | null) =>
  DEMO_AUTH_USERS.find(user => user.id === userId);

export const createMockAccessToken = (userId: number) =>
  `mock-access-token-${userId}`;

export const createMockRefreshToken = (userId: number) =>
  `mock-refresh-token-${userId}`;

export const getUserIdFromAccessToken = (token: string) => {
  const match = token.match(/^mock-access-token-(\d+)$/);
  return match ? Number(match[1]) : null;
};

export const updateDemoUserProfile = (
  user: MockUser,
  profile: {
    nickname?: string;
    profile_image_url?: string;
  },
) => {
  Object.assign(user, {
    nickname: profile.nickname || user.nickname,
    profile_image_url: profile.profile_image_url || user.profile_image_url,
  });

  return {
    nickname: user.nickname,
    profile_image_url: user.profile_image_url,
  };
};
