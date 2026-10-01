export type DRFPage<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type IdolServer = {
  id: number;
  name: string;
  user: number;
  group: number | null;
  created_at: string;
  updated_at: string;
  avatar_url?: string | null;
  group_name?: string;
  position?: Idol['position'];
};

export type Idol = {
  id: string;
  name: string;
  groupName?: string;
  avatarUrl?: string;
  position?: '보컬' | '댄서' | '랩';
};
