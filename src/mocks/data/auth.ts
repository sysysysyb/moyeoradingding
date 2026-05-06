export type MockUserRole = 'NORMAL' | 'MANAGER' | 'IDOL' | 'ADMIN';

export interface MockUser {
  id: number;
  email: string;
  nickname: string;
  password: string;
  role: MockUserRole;
  profile_image_url: string;
}

export const DEMO_AUTH_USER: MockUser = {
  id: 1,
  email: 'test@test.com',
  nickname: 'test',
  password: 'test123!',
  role: 'NORMAL',
  profile_image_url: 'default-profile.jpg',
};

export const createMockAccessToken = (userId: number) =>
  `mock-access-token-${userId}`;

export const createMockRefreshToken = (userId: number) =>
  `mock-refresh-token-${userId}`;

export const getUserIdFromAccessToken = (token: string) => {
  const match = token.match(/^mock-access-token-(\d+)$/);
  return match ? Number(match[1]) : null;
};
