import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import { getChatMessageAPI } from '@/api/chatApi';
import { useChatStore } from '@/stores/chatRoomIdStore';
import {
  toFlattenChats,
  toGroupedChatMap,
  toSortedChats,
} from '@/utils/chat.utils';

import type { FlattenChatTypes } from '../../chat.types';
import ChatMessageGroup from './ChatMessageGroup';
import DateDivider from './DateDivider';

const renderDataByTime = (_: number, chatData: FlattenChatTypes) => {
  if (chatData.type === 'date') return <DateDivider dKey={chatData.dKey} />;
  return <ChatMessageGroup tKey={chatData.tKey} tValue={chatData.tValue} />;
};

function ChatMessageList() {
  const [atBottom, setAtBottom] = useState(true);
  const listRef = useRef<VirtuosoHandle>(null);
  const { roomId } = useChatStore();

  const messagesQuery = useInfiniteQuery({
    queryKey: ['getChatMessage', roomId],
    queryFn: ({ pageParam }) => getChatMessageAPI(roomId!, Number(pageParam)),
    enabled: !!roomId,
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (!lastPage.next) return undefined;
      return Number(new URL(lastPage.next).searchParams.get('page'));
    },
  });

  if (messagesQuery.isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        메시지를 불러오는 중입니다...
      </div>
    );
  }

  if (messagesQuery.isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p>메시지를 불러오지 못했습니다.</p>
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

  const messages = messagesQuery.data.pages.flatMap(page => page.results);
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        첫 메시지를 보내보세요.
      </div>
    );
  }

  const flattenedChatData = toFlattenChats(
    toGroupedChatMap(toSortedChats(messages)),
  );

  return (
    <div className="relative h-full">
      <Virtuoso
        ref={listRef}
        className="chat-scrollbar py-2 pe-2"
        data={flattenedChatData}
        initialTopMostItemIndex={flattenedChatData.length - 1}
        firstItemIndex={10000 - flattenedChatData.length}
        computeItemKey={(_, data) => data.key}
        followOutput={atBottom ? 'smooth' : false}
        atBottomStateChange={setAtBottom}
        itemContent={renderDataByTime}
        atTopStateChange={atTop => {
          if (
            atTop &&
            messagesQuery.hasNextPage &&
            !messagesQuery.isFetchingNextPage
          ) {
            messagesQuery.fetchNextPage();
          }
        }}
        increaseViewportBy={{ top: 200, bottom: 0 }}
      />
      {!atBottom && (
        <button
          type="button"
          className="absolute right-4 bottom-4 rounded-full bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-fuchsia-600"
          onClick={() =>
            listRef.current?.scrollToIndex({
              index: flattenedChatData.length - 1,
              align: 'end',
              behavior: 'smooth',
            })
          }
        >
          최신 메시지 보기
        </button>
      )}
    </div>
  );
}

export default ChatMessageList;
