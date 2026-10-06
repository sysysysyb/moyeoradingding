import clsx from 'clsx';

import { UserAvatarImage } from '@/components/common/UserAvatarImage';
import { useUserStore } from '@/stores/userStore';

import { ChatMessageItemStyles } from '../../chat.styles';
import type { GroupedChatTypes } from '../../chat.types';
import ChatMessageBubble from './ChatMessageBubble';

function ChatMessageItem(data: GroupedChatTypes) {
  const { user } = useUserStore();
  const userId = user?.user_id;

  const { sender, contents } = data;
  const isMyChat = sender.id === userId;
  const bubbles = contents.map(content => (
    <ChatMessageBubble
      key={content.id}
      id={content.id}
      isMyChat={isMyChat}
      text={content.text}
    />
  ));

  return (
    <div className={clsx(ChatMessageItemStyles({ myChat: isMyChat }))}>
      {isMyChat && bubbles}

      {!isMyChat && (
        <>
          <UserAvatarImage profileImageUrl={sender.profile_image_url} />
          <div className="flex w-full flex-col">
            <span className="text-xs font-medium text-gray-900">
              {sender.nickname}
            </span>
            {bubbles}
          </div>
        </>
      )}
    </div>
  );
}

export default ChatMessageItem;
