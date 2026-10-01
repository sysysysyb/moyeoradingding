import { UserIcon } from '@heroicons/react/24/outline';

import { UserAvatarImage } from '@/components/common/UserAvatarImage';
import { useLogout } from '@/hooks/useLogout';
import { usePageNav } from '@/hooks/usePageNav';
import { useUserStore } from '@/stores/userStore';

type UserDropdownProps = {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
};

function UserDropdown({ isOpen, onToggle, isMobile }: UserDropdownProps) {
  const { user } = useUserStore();
  const { navigateToMypage } = usePageNav();
  const { handleLogout, confirmationDialog } = useLogout();

  const userGreetingClass = 'text-base font-medium text-gray-600 my-4';
  const dropdownItemClass =
    'w-full pl-2 py-2 text-base text-left font-semibold text-gray-700 hover:font-bold hover:text-fuchsia-500';

  const dropdownContent = (
    <div className="w-full py-1">
      {confirmationDialog}
      <div className="mb-7 flex flex-col items-center">
        <UserAvatarImage
          profileImageUrl={user?.profile_image_url}
          altText="사용자 프로필 이미지"
          avatarSize="xl"
          className="shadow-sm"
        />
        <div className={userGreetingClass}>{user?.nickname}님, 환영합니다</div>
      </div>

      <button
        type="button"
        onClick={navigateToMypage}
        className={dropdownItemClass}
      >
        마이페이지
      </button>

      <hr className="mx-1 my-3 border border-gray-200" />

      <button
        type="button"
        onClick={handleLogout}
        className={dropdownItemClass}
      >
        로그아웃
      </button>
    </div>
  );

  // 모바일 환경: 버튼 없이 바로 콘텐츠만 렌더링
  if (isMobile) return dropdownContent;

  // 데스크탑 환경: 사용자 아이콘 버튼과 드롭다운 함께 렌더링
  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={onToggle}
        className="mr-[-8px] flex cursor-pointer items-center justify-center rounded-full p-2 transition hover:bg-gray-100"
        aria-label="사용자 드롭다운 열기"
      >
        <UserIcon className="h-6 w-6 text-gray-700" />
      </button>

      {isOpen && (
        <div className="absolute top-13 right-0 z-50 mr-[-6px] hidden w-52 border border-gray-200 bg-white p-4 shadow min-[1476px]:right-1/2 min-[1476px]:translate-x-1/2 md:block">
          {dropdownContent}
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
