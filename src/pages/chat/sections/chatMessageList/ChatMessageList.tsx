/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- Named scroll region must be keyboard-scrollable. */
import { useInfiniteQuery } from '@tanstack/react-query';
import { useLayoutEffect, useRef, useState } from 'react';

import { getChatMessageAPI } from '@/api/chatApi';
import { useChatStore } from '@/stores/chatRoomIdStore';
import {
  toFlattenChats,
  toGroupedChatMap,
  toSortedChats,
} from '@/utils/chat.utils';

import ChatMessageGroup from './ChatMessageGroup';
import DateDivider from './DateDivider';

const initialPageParam: { page: number; beforeId?: number } = { page: 1 };

function ChatMessageList() {
  const { roomId } = useChatStore();
  const [atBottom, setAtBottom] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const position = useRef<{
    atBottom: boolean;
    anchor: { id: string; offset: number } | null;
  }>({ atBottom: true, anchor: null });
  const fetchingOlder = useRef(false);

  const messagesQuery = useInfiniteQuery({
    queryKey: ['getChatMessage', roomId],
    queryFn: ({ pageParam, signal }) =>
      getChatMessageAPI(roomId!, pageParam.page, pageParam.beforeId, signal),
    enabled: !!roomId,
    initialPageParam,
    staleTime: Infinity,
    // Leaving a room discards its pagination; the keyed component resets its position.
    gcTime: 0,
    getNextPageParam: lastPage => {
      if (!lastPage.next) return undefined;
      const params = new URL(lastPage.next).searchParams;
      return {
        page: Number(params.get('page')),
        beforeId: params.has('before_id')
          ? Number(params.get('before_id'))
          : undefined,
      };
    },
  });

  const rememberPosition = () => {
    const list = listRef.current;
    if (!list) return;
    const bottom = list.scrollHeight - list.scrollTop - list.clientHeight <= 32;
    const { top } = list.getBoundingClientRect();
    // ponytail: linear DOM scan for the baseline; revisit with the virtual renderer.
    const visible = Array.from(
      list.querySelectorAll<HTMLElement>('[data-chat-message-id]'),
    ).find(element => element.getBoundingClientRect().bottom > top);
    position.current = {
      atBottom: bottom,
      anchor: visible
        ? {
            id: visible.dataset.chatMessageId!,
            offset: visible.getBoundingClientRect().top - top,
          }
        : null,
    };
    setAtBottom(bottom);
  };

  const restorePosition = () => {
    const list = listRef.current;
    if (!list) return;
    if (position.current.atBottom) {
      list.scrollTop = list.scrollHeight;
    } else if (position.current.anchor) {
      const { id, offset } = position.current.anchor;
      const anchor = list.querySelector<HTMLElement>(
        `[data-chat-message-id="${id}"]`,
      );
      if (anchor) {
        list.scrollTop +=
          anchor.getBoundingClientRect().top -
          list.getBoundingClientRect().top -
          offset;
      }
    }
    rememberPosition();
  };

  useLayoutEffect(() => {
    restorePosition();
    const observer = new ResizeObserver(restorePosition);
    if (contentRef.current) observer.observe(contentRef.current);
    if (listRef.current) observer.observe(listRef.current);
    return () => observer.disconnect();
    // Reconcile after data updates and when loading/empty/error views mount the list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesQuery.data, messagesQuery.isPending]);

  const loadOlder = async () => {
    if (
      !messagesQuery.hasNextPage ||
      messagesQuery.isFetching ||
      fetchingOlder.current
    ) {
      return;
    }
    fetchingOlder.current = true;
    try {
      await messagesQuery.fetchNextPage({ cancelRefetch: false });
    } finally {
      fetchingOlder.current = false;
    }
  };

  if (messagesQuery.isPending) {
    return (
      <div className="flex h-full items-center justify-center" role="status">
        메시지를 불러오는 중입니다...
      </div>
    );
  }

  if (messagesQuery.isError && !messagesQuery.data) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p role="alert">메시지를 불러오지 못했습니다.</p>
        <button
          type="button"
          className="mt-3 text-fuchsia-700 underline"
          onClick={() => messagesQuery.refetch()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  const uniqueMessages = new Map(
    messagesQuery.data?.pages
      .flatMap(page => page.results)
      .map(message => [message.id, message]),
  );
  const messages = Array.from(uniqueMessages.values());
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center" role="status">
        첫 메시지를 보내보세요.
      </div>
    );
  }

  const flattenedChatData = toFlattenChats(
    toGroupedChatMap(toSortedChats(messages)),
  );

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="flex h-8 shrink-0 items-center justify-center text-sm">
        {messagesQuery.isError ? (
          <button
            type="button"
            className="text-fuchsia-700 underline"
            onClick={() =>
              messagesQuery.isFetchNextPageError
                ? loadOlder()
                : messagesQuery.refetch()
            }
          >
            메시지를 불러오지 못했습니다. 다시 시도
          </button>
        ) : (
          messagesQuery.hasNextPage && (
            <button
              type="button"
              className="text-fuchsia-700 underline disabled:text-gray-500"
              disabled={messagesQuery.isFetching}
              onClick={loadOlder}
            >
              {messagesQuery.isFetchingNextPage
                ? '이전 메시지를 불러오는 중...'
                : '이전 메시지 불러오기'}
            </button>
          )
        )}
      </div>
      <div
        ref={listRef}
        aria-label="채팅 메시지 목록"
        role="region"
        tabIndex={0}
        className="chat-scrollbar min-h-0 flex-1 overflow-y-auto py-2 pe-2"
        style={{ overflowAnchor: 'none' }}
        onScroll={() => {
          rememberPosition();
          if (
            listRef.current &&
            listRef.current.scrollTop <= 80 &&
            !messagesQuery.isError
          ) {
            loadOlder();
          }
        }}
      >
        <div ref={contentRef}>
          {flattenedChatData.map(chatData => (
            <div key={chatData.key}>
              {chatData.type === 'date' ? (
                <DateDivider dKey={chatData.dKey} />
              ) : (
                <ChatMessageGroup
                  tKey={chatData.tKey}
                  tValue={chatData.tValue}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {!atBottom && (
        <button
          type="button"
          className="absolute right-4 bottom-4 rounded-full bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-fuchsia-600"
          onClick={() => {
            position.current.atBottom = true;
            restorePosition();
          }}
        >
          최신 메시지 보기
        </button>
      )}
    </div>
  );
}

export default ChatMessageList;
