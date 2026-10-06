import type { ChatMessage, ChatParticipant } from '@/pages/chat/chat.types';

import { getDemoUserById } from './auth';
import { createChatBenchmark, isChatBenchmark } from './chatBenchmark';

const MANAGER_PROFILE_IMAGE = 'https://picsum.photos/id/237/300/300';

export const CHAT_EXAMPLES = [
  {
    id: 'm-000',
    sender: {
      id: 'manager-01',
      nickname: 'VIVIZ 매니저',
      profile_image: MANAGER_PROFILE_IMAGE,
    },
    content: '이번 주 주요 일정 정리해서 공유드릴게요.',
    sendAt: '2025-08-01T03:20:00Z',
  },
  {
    id: 'm-000a',
    sender: {
      id: 'idol-01',
      nickname: '은하',
      profile_image: undefined,
    },
    content: '네 감사합니다! 정리본 받으면 캘린더에 반영할게요.',
    sendAt: '2025-08-01T03:25:10Z',
  },
  {
    id: 'm-000b',
    sender: {
      id: 'manager-01',
      nickname: 'VIVIZ 매니저',
      profile_image: MANAGER_PROFILE_IMAGE,
    },
    content: '내일 팬사인회 사전 동선 다시 한 번 체크 부탁드려요.',
    sendAt: '2025-08-18T14:55:00Z',
  },
  {
    id: 'm-000c',
    sender: {
      id: 'idol-01',
      nickname: '은하',
      profile_image: undefined,
    },
    content: '네, 리허설 포함해서 점검 목록 업데이트해둘게요.',
    sendAt: '2025-08-18T15:02:30Z',
  },
  {
    id: 'm-001',
    sender: {
      id: 'manager-01',
      nickname: 'VIVIZ 매니저',
      profile_image: MANAGER_PROFILE_IMAGE,
    },
    content: '스케줄 확인 가능해요?',
    sendAt: '2025-08-19T05:59:10Z',
  },
  {
    id: 'm-002',
    sender: {
      id: 'idol-01',
      nickname: '은하',
      profile_image: undefined,
    },
    content: '네, 지금 확인 중입니다!',
    sendAt: '2025-08-19T06:00:05Z',
  },
  {
    id: 'm-003',
    sender: {
      id: 'manager-01',
      nickname: 'VIVIZ 매니저',
      profile_image: MANAGER_PROFILE_IMAGE,
    },
    content: '내일 팬사인회 장소가 변경됐어요.',
    sendAt: '2025-08-19T06:01:20Z',
  },
  {
    id: 'm-004',
    sender: {
      id: 'manager-01',
      nickname: 'VIVIZ 매니저',
      profile_image: MANAGER_PROFILE_IMAGE,
    },
    content:
      '기존 A홀 → B홀(3층). 동선은 대기실→스테이지→포토월 순서고, 입장 10분 전에 리허설 한 번 잡을게요.',
    sendAt: '2025-08-19T06:01:20Z',
  },
  {
    id: 'm-005',
    sender: {
      id: 'idol-01',
      nickname: '은하',
      profile_image: undefined,
    },
    content: 'B홀 3층 확인했습니다. 리허설 2시간 전 합류할게요.',
    sendAt: '2025-08-19T06:02:48Z',
  },
  {
    id: 'm-006',
    sender: {
      id: 'manager-01',
      nickname: 'VIVIZ 매니저',
      profile_image: MANAGER_PROFILE_IMAGE,
    },
    content: '의상 컨펌도 부탁해요. 2번 안으로 가면 좋을 듯!',
    sendAt: '2025-08-19T06:05:00Z',
  },
  {
    id: 'm-007',
    sender: {
      id: 'idol-01',
      nickname: '은하',
      profile_image: undefined,
    },
    content: '2번 찬성! 신발은 화이트로 갈게요.',
    sendAt: '2025-08-19T06:05:45Z',
  },
  {
    id: 'm-008',
    sender: {
      id: 'manager-01',
      nickname: 'VIVIZ 매니저',
      profile_image: MANAGER_PROFILE_IMAGE,
    },
    content:
      '좋아요. 그리고 팬미팅 종료 후 바로 인터뷰 하나 있어요(로비 C구역). 이동 동선 겹치지 않도록 스태프 배치해 둘게요.',
    sendAt: '2025-08-19T06:08:12Z',
  },
  {
    id: 'm-009',
    sender: {
      id: 'idol-01',
      nickname: '은하',
      profile_image: undefined,
    },
    content: '확인! 끝나고 바로 이동하겠습니다 🙌',
    sendAt: '2025-08-19T06:09:30Z',
  },
  {
    id: 'm-010',
    sender: {
      id: 'idol-01',
      nickname: '은하',
      profile_image: undefined,
    },
    content: '스태프 분들께도 공지 부탁드려요. 고생 많으십니다!',
    sendAt: '2025-08-19T06:10:05Z',
  },
];

export const CHAT_FIXTURE_VERSION = '3';
export const CHAT_REPLY_SEED = 20260930;
export const CHAT_ROOM_ID = 1;

export const CHAT_PARTICIPANTS: ChatParticipant[] = [
  { id: 2, nickname: '은하', profile_image: 0 },
  { id: 4, nickname: '신비', profile_image: 0 },
  { id: 5, nickname: '엄지', profile_image: 0 },
  { id: 3, nickname: 'VIVIZ 매니저', profile_image: 0 },
];

const CHAT_REPLY_CANDIDATES = [
  '확인했어요! 일정도 함께 살펴볼게요.',
  '좋아요. 필요한 내용은 이 채팅에 남겨주세요.',
  '알려줘서 고마워요. 곧 다시 확인해드릴게요.',
  '네, 준비해둘게요. 변경 사항이 있으면 말씀해주세요.',
  '메시지 받았어요! 함께 진행해요 🙌',
];

let messages: ChatMessage[] = isChatBenchmark
  ? createChatBenchmark()
  : CHAT_EXAMPLES.map((example, index) => {
      const user = getDemoUserById(example.sender.id === 'manager-01' ? 3 : 2)!;
      return {
        id: index + 1,
        sender: {
          id: user.id,
          nickname: user.nickname,
          role: user.role as 'MANAGER' | 'IDOL',
          profile_image_url: user.profile_image_url,
        },
        content: example.content,
        sent_at: example.sendAt,
      };
    });
let replyCount = 0;

export const getMockChatMessages = () => messages;

export const addMockChatMessage = (userId: number, content: string) => {
  const user = getDemoUserById(userId);
  const replyUser = getDemoUserById(userId === 3 ? 2 : 3);
  if (!user || !replyUser) return null;

  const lastSentAt = Date.parse(messages.at(-1)?.sent_at || '2025-08-01');
  const sentAt = isChatBenchmark
    ? lastSentAt + 1
    : Math.max(Date.now(), lastSentAt + 1);
  const createMessage = (
    sender: typeof user,
    text: string,
    offset: number,
  ): ChatMessage => ({
    id: messages.length + offset,
    sender: {
      id: sender.id,
      nickname: sender.nickname,
      role: sender.role as ChatMessage['sender']['role'],
      profile_image_url: isChatBenchmark ? null : sender.profile_image_url,
    },
    content: text,
    sent_at: new Date(sentAt + offset - 1).toISOString(),
  });

  const message = createMessage(user, content, 1);
  const reply = createMessage(
    replyUser,
    CHAT_REPLY_CANDIDATES[
      (CHAT_REPLY_SEED + replyCount * 7) % CHAT_REPLY_CANDIDATES.length
    ],
    2,
  );
  replyCount += 1;
  messages = [...messages, message, reply];
  return { message, reply };
};
