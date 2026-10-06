export type GroupedChatTypes = Omit<ChatMessage, 'content' | 'sent_at'> & {
  contents: Array<{ id: number; text: string }>;
};

export type GroupedChatListTypes = Record<
  string,
  Record<string, GroupedChatTypes[]>
>;

export interface ChatMessageGroupTypes {
  tKey: string;
  tValue: GroupedChatTypes[];
}

export interface ChatMessageBubbleTypes {
  id: number;
  isMyChat: boolean;
  text: string;
}

export type FlattenChatTypes =
  | { type: 'date'; dKey: string; key: string }
  | {
      type: 'time';
      dKey: string;
      tKey: string;
      tValue: GroupedChatTypes[];
      key: string;
    };

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ChatParticipant = {
  id: number;
  nickname: string;
  profile_image: number;
};

export type ChatMessage = {
  id: number;
  sender: {
    id: number;
    nickname: string;
    role: 'NORMAL' | 'IDOL' | 'MANAGER';
    profile_image_url: string | null;
  };
  content: string;
  sent_at: string;
};
