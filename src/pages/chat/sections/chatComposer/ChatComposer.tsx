import { PaperAirplaneIcon, UsersIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useState } from 'react';

import { ChatComposerButtonStyles } from '../../chat.styles';

interface ChatComposerProps {
  onSend: (content: string) => Promise<boolean>;
  isSending: boolean;
  onToggleList: () => void;
}

function ChatComposer({ onSend, isSending, onToggleList }: ChatComposerProps) {
  const [inputValue, setInputValue] = useState('');
  const trimmedInputValue = inputValue.trim();

  const handleChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (trimmedInputValue && !isSending && (await onSend(trimmedInputValue))) {
      setInputValue('');
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 p-2">
      <input
        type="text"
        maxLength={1000}
        placeholder="메시지를 입력하세요..."
        value={inputValue}
        onChange={handleChangeInputValue}
        onKeyDown={handleEnterKeyDown}
        className="text-md placeholder:text-gray-7800 flex-1 rounded-[56px] bg-gray-100 py-3 pr-12.5 pl-4 font-medium text-gray-800 outline-gray-500"
      />
      {!inputValue && (
        <button
          type="button"
          className={clsx(
            ChatComposerButtonStyles,
            'block hover:bg-fuchsia-500 lg:hidden',
          )}
          onClick={onToggleList}
        >
          <UsersIcon className="block size-8 text-gray-700 group-hover:text-fuchsia-200" />
        </button>
      )}

      {trimmedInputValue && (
        <button
          type="button"
          aria-label="메시지 보내기"
          disabled={isSending}
          className={clsx(
            ChatComposerButtonStyles,
            'bg-fuchsia-500 hover:bg-fuchsia-600',
          )}
          onClick={handleSendMessage}
        >
          <PaperAirplaneIcon className="size-8 text-fuchsia-200 group-hover:text-fuchsia-300" />
        </button>
      )}
    </div>
  );
}

export default ChatComposer;
