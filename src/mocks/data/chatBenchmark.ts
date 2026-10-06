import type { ChatMessage } from '@/pages/chat/chat.types';

export const CHAT_BENCHMARK_VERSION = 'chat-baseline-v1';
export const CHAT_BENCHMARK_SEED = 20260930;
export const isChatBenchmark =
  new URLSearchParams(window.location.search).get('benchmark') ===
  CHAT_BENCHMARK_VERSION;

export const createChatBenchmark = (): ChatMessage[] =>
  Array.from({ length: 10000 }, (_, index) => {
    const mine = Math.floor(index / 2) % 2 === 0;
    const repetitions = 1 + ((CHAT_BENCHMARK_SEED + index * 7) % 9);
    return {
      id: index + 1,
      sender: {
        id: mine ? 3 : 2,
        nickname: mine ? 'VIVIZ 매니저' : '은하',
        role: mine ? 'MANAGER' : 'IDOL',
        profile_image_url: null,
      },
      content: `[${index + 1}] ${'일정과 준비 내용을 확인해주세요. '.repeat(repetitions)}`,
      sent_at: new Date(Date.UTC(2025, 7, 1) + index * 60000).toISOString(),
    };
  });
