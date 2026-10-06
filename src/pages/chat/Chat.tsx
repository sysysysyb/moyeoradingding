import {
  type InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { getMyChatRoomListAPI, sendChatMessageAPI } from '@/api/chatApi';
import { useChatStore } from '@/stores/chatRoomIdStore';
import { showErrorToast } from '@/utils/toastUtils';

import type { ChatMessage, PaginatedResponse } from './chat.types';
import ChatComposer from './sections/chatComposer/ChatComposer';
import ChatContactList from './sections/chatContactList/ChatContactList';
import ChatMessageList from './sections/chatMessageList/ChatMessageList';

function Chat() {
  const [isVisible, setIsVisible] = useState(false);
  const { roomId, setRoomId, clearRoomId } = useChatStore();
  const queryClient = useQueryClient();

  const roomListQuery = useQuery({
    queryKey: ['getMyChatRoomList'],
    queryFn: getMyChatRoomListAPI,
  });

  const selectedRoomId = roomListQuery.data?.results[0]?.id;
  useEffect(() => {
    if (selectedRoomId) setRoomId(selectedRoomId);
    else clearRoomId();
  }, [clearRoomId, selectedRoomId, setRoomId]);

  const sendMutation = useMutation({
    mutationFn: (message: { roomId: number; content: string }) =>
      sendChatMessageAPI(message.roomId, message.content),
    onSuccess: async (result, variables) => {
      // A pending pagination response must not replace the newly appended messages.
      await queryClient.cancelQueries({
        queryKey: ['getChatMessage', variables.roomId],
        exact: true,
      });
      if (!queryClient.getQueryData(['getChatMessage', variables.roomId])) {
        await queryClient.invalidateQueries({
          queryKey: ['getChatMessage', variables.roomId],
          exact: true,
        });
        return;
      }
      queryClient.setQueryData<InfiniteData<PaginatedResponse<ChatMessage>>>(
        ['getChatMessage', variables.roomId],
        current => {
          if (!current) return current;
          return {
            ...current,
            pages: current.pages.map((page, index) => ({
              ...page,
              count: page.count + 2,
              results:
                index === 0
                  ? [...page.results, result.message, result.reply]
                  : page.results,
            })),
          };
        },
      );
    },
    onError: () =>
      showErrorToast('메시지를 보내지 못했습니다. 다시 시도해주세요.'),
  });

  const handleSendMessage = async (content: string) => {
    if (!roomId) return false;
    try {
      await sendMutation.mutateAsync({ roomId, content });
      return true;
    } catch {
      return false;
    }
  };

  if (
    roomListQuery.isPending ||
    (selectedRoomId && roomId !== selectedRoomId)
  ) {
    return <div className="p-8 text-center">채팅방을 불러오는 중입니다...</div>;
  }

  if (roomListQuery.isError) {
    return (
      <div className="p-8 text-center">
        <p>채팅방을 불러오지 못했습니다.</p>
        <button
          type="button"
          className="mt-3 text-fuchsia-700 underline"
          onClick={() => roomListQuery.refetch()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!selectedRoomId) {
    return <div className="p-8 text-center">참여 중인 채팅방이 없습니다.</div>;
  }

  return (
    <div className="relative flex h-[calc(100dvh-64px)]">
      <aside
        className={clsx(
          'h-full',
          isVisible
            ? 'absolute z-10 block w-full lg:static lg:w-auto lg:flex-1'
            : 'hidden lg:block',
        )}
      >
        <ChatContactList
          isVisible={isVisible}
          onToggleList={() => setIsVisible(prev => !prev)}
        />
      </aside>
      <article className="relative flex min-h-0 flex-3 flex-col px-4">
        <section className="min-h-0 flex-1 pt-4">
          <ChatMessageList key={roomId} />
        </section>
        <section className="shrink-0">
          <ChatComposer
            onSend={handleSendMessage}
            isSending={sendMutation.isPending}
            onToggleList={() => setIsVisible(prev => !prev)}
          />
        </section>
      </article>
    </div>
  );
}

export default Chat;
