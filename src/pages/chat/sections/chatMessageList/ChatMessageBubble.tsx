import clsx from 'clsx';

import { ChatMessageBubbleStyles } from '../../chat.styles';
import type { ChatMessageBubbleTypes } from '../../chat.types';

function ChatMessageBubble({ id, isMyChat, text }: ChatMessageBubbleTypes) {
  return (
    <div
      data-chat-message-id={id}
      className={clsx(ChatMessageBubbleStyles({ myChat: isMyChat }))}
    >
      {text}
    </div>
  );
}

export default ChatMessageBubble;
