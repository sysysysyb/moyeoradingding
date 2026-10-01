import clsx from 'clsx';

import { useLogout } from '@/hooks/useLogout';

export default function BottomNav({ className }: { className?: string }) {
  const { handleLogout, confirmationDialog } = useLogout();

  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-3 border-gray-200 py-10 text-xs md:items-start md:gap-6 md:border-t-1 md:text-sm',
        className,
      )}
    >
      {confirmationDialog}
      <button type="button" className="mx-4" onClick={handleLogout}>
        <p className="hover:underline">로그아웃</p>
      </button>
      <button type="button" className="mx-4">
        <p className="hover:underline">회원 탈퇴</p>
      </button>
    </div>
  );
}
