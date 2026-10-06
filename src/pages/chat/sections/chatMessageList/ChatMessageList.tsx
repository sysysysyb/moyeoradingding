/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- Named scroll region must be keyboard-scrollable. */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions -- The named scroll region handles virtualized Home/End navigation. */
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { getChatMessageAPI } from '@/api/chatApi';
import { useChatStore } from '@/stores/chatRoomIdStore';
import { useUserStore } from '@/stores/userStore';
import {
  toFlattenChats,
  toGroupedChatMap,
  toSortedChats,
} from '@/utils/chat.utils';

import type { GroupedChatTypes } from '../../chat.types';
import ChatMessageItem from './ChatMessageItem';
import DateDivider from './DateDivider';
import TimeDivider from './TimeDivider';

type ChatRow =
  | { type: 'date'; key: string; dKey: string }
  | {
      type: 'message';
      key: string;
      data: GroupedChatTypes;
      continuation: boolean;
    }
  | { type: 'time'; key: string; tKey: string; isLastMsgMine: boolean };

const initialPageParam: { page: number; beforeId?: number } = { page: 1 };

function ChatMessageList() {
  const { roomId } = useChatStore();
  const [atBottom, setAtBottom] = useState(true);
  const atBottomRef = useRef(true);
  const listRef = useRef<HTMLDivElement>(null);
  const fetchingOlder = useRef(false);
  const awaitingOlderPage = useRef(false);
  const prependAnchor = useRef<{ id: string; offset: number } | null>(null);

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

  const { user } = useUserStore();
  const rows = useMemo(() => {
    const uniqueMessages = new Map(
      messagesQuery.data?.pages
        .flatMap(page => page.results)
        .map(message => [message.id, message]),
    );
    return toFlattenChats(
      toGroupedChatMap(toSortedChats(Array.from(uniqueMessages.values()))),
    ).flatMap<ChatRow>(chatData =>
      chatData.type === 'date'
        ? [chatData]
        : [
            ...chatData.tValue.flatMap(group =>
              group.contents.map((content, index) => ({
                type: 'message' as const,
                key: `M-${content.id}`,
                data: { ...group, contents: [content] },
                continuation: index > 0,
              })),
            ),
            {
              type: 'time',
              key: `T-${chatData.dKey}-${chatData.tKey}-${chatData.tValue.at(-1)?.contents.at(-1)?.id}`,
              tKey: chatData.tKey,
              isLastMsgMine:
                chatData.tValue.at(-1)?.sender.id === user?.user_id,
            },
          ],
    );
  }, [messagesQuery.data, user?.user_id]);

  const getItemKey = useCallback((index: number) => rows[index].key, [rows]);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => listRef.current,
    getItemKey,
    estimateSize: () => 72,
    overscan: 6,
    paddingStart: 8,
    paddingEnd: 8,
    anchorTo: 'end',
    followOnAppend: true,
    scrollEndThreshold: 32,
  });

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    virtualizer.scrollToEnd();
    const observer = new ResizeObserver(() => {
      if (atBottomRef.current) virtualizer.scrollToEnd();
    });
    observer.observe(list);
    return () => observer.disconnect();
    // Reattach when loading/empty/error views mount the list; keep a resized viewport pinned.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesQuery.isPending, rows.length > 0]);

  useLayoutEffect(() => {
    awaitingOlderPage.current = false;
    const anchor = prependAnchor.current;
    const list = listRef.current;
    if (!anchor || !list) return undefined;
    const selector = `[data-chat-message-id="${anchor.id}"]`;
    // A date divider can disappear when an older page extends the same day.
    // Anchor the message rather than that transient separator.
    if (!list.querySelector(selector)) {
      const index = rows.findIndex(row => row.key === `M-${anchor.id}`);
      if (index >= 0) virtualizer.scrollToIndex(index, { align: 'start' });
    }
    const frame = requestAnimationFrame(() => {
      const element = list.querySelector<HTMLElement>(selector);
      if (element) {
        virtualizer.scrollToOffset(
          list.scrollTop +
            element.getBoundingClientRect().top -
            list.getBoundingClientRect().top -
            anchor.offset,
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [messagesQuery.data, rows, virtualizer]);

  const rememberPrependAnchor = () => {
    prependAnchor.current = null;
    const list = listRef.current;
    if (list && list.scrollHeight - list.scrollTop - list.clientHeight > 32) {
      const { top, bottom } = list.getBoundingClientRect();
      const visible = Array.from(
        list.querySelectorAll<HTMLElement>('[data-chat-message-id]'),
      ).find(element => {
        const rect = element.getBoundingClientRect();
        return rect.bottom > top && rect.top < bottom;
      });
      if (visible) {
        prependAnchor.current = {
          id: visible.dataset.chatMessageId!,
          offset: visible.getBoundingClientRect().top - top,
        };
      }
    }
  };

  useLayoutEffect(() => {
    if (awaitingOlderPage.current) rememberPrependAnchor();
  });

  const loadOlder = async () => {
    if (
      !messagesQuery.hasNextPage ||
      messagesQuery.isFetching ||
      fetchingOlder.current
    ) {
      return;
    }
    fetchingOlder.current = true;
    awaitingOlderPage.current = true;
    rememberPrependAnchor();
    try {
      await messagesQuery.fetchNextPage({ cancelRefetch: false });
      // Keep the guard through the virtualizer's measurement and anchor correction.
      await new Promise<void>(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
    } finally {
      awaitingOlderPage.current = false;
      prependAnchor.current = null;
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

  if (rows.length === 0) {
    return (
      <div className="flex h-full items-center justify-center" role="status">
        첫 메시지를 보내보세요.
      </div>
    );
  }

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
        className="chat-scrollbar min-h-0 flex-1 overflow-y-auto pe-2"
        style={{ overflowAnchor: 'none' }}
        onKeyDown={event => {
          if (event.key === 'Home') {
            event.preventDefault();
            virtualizer.scrollToIndex(0, { align: 'start' });
          } else if (event.key === 'End') {
            event.preventDefault();
            virtualizer.scrollToEnd();
          }
        }}
        onScroll={event => {
          const list = event.currentTarget;
          atBottomRef.current =
            list.scrollHeight - list.scrollTop - list.clientHeight <= 32;
          setAtBottom(atBottomRef.current);
          if (awaitingOlderPage.current) rememberPrependAnchor();
          if (list.scrollTop <= 80 && !messagesQuery.isError) {
            // React's scroll handler runs before the virtual range updates.
            requestAnimationFrame(() => {
              if (list.isConnected && list.scrollTop <= 80) loadOlder();
            });
          }
        }}
      >
        <div
          style={{ height: virtualizer.getTotalSize(), position: 'relative' }}
        >
          {virtualizer.getVirtualItems().map(item => {
            const row = rows[item.index];
            return (
              <div
                key={item.key}
                ref={virtualizer.measureElement}
                data-index={item.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${item.start}px)`,
                }}
              >
                {row.type === 'date' && <DateDivider dKey={row.dKey} />}
                {row.type === 'message' && (
                  <ChatMessageItem
                    {...row.data}
                    continuation={row.continuation}
                  />
                )}
                {row.type === 'time' && (
                  <TimeDivider
                    tKey={row.tKey}
                    isLastMsgMine={row.isLastMsgMine}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {!atBottom && (
        <button
          type="button"
          className="absolute right-4 bottom-4 rounded-full bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-fuchsia-600"
          onClick={() => {
            virtualizer.scrollToEnd();
          }}
        >
          최신 메시지 보기
        </button>
      )}
    </div>
  );
}

export default ChatMessageList;
