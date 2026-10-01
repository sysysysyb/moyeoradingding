import { Button } from '@/components/common/Button';
import { UserAvatarImage } from '@/components/common/UserAvatarImage';
import { mediaQuery } from '@/constants/breakpoints';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useUserStore } from '@/stores/userStore';

interface ProfileProp {
  onEditClick: () => void;
}

export default function Profile({ onEditClick }: ProfileProp) {
  const { user } = useUserStore();

  const isDesktop = useMediaQuery(mediaQuery.tablet);
  const isMobile = useMediaQuery(mediaQuery.mobile);

  let avatarSize: '2xl' | 'md' | 'xl' = 'xl';
  if (isDesktop) avatarSize = '2xl';
  else if (isMobile) avatarSize = 'md';
  const buttonSize = isMobile ? 'sm' : 'md';

  return (
    <section className="my-6 flex items-center justify-between gap-6 rounded-3xl border-2 border-gray-200 p-6 md:my-10 md:flex-col md:border-none">
      <div className="flex items-center gap-6 md:flex-col">
        <UserAvatarImage avatarSize={avatarSize} />

        <div>
          <p className="text-xs text-gray-500 sm:text-sm md:text-3xl md:text-black">
            안녕하세요, {user?.nickname}님!
          </p>
          <p className="text-xl font-semibold md:hidden">{user?.nickname}</p>
        </div>
        <p className="hidden text-gray-500 md:block">{user?.email}</p>
      </div>

      <Button
        shape="pill"
        variant="secondary"
        size={buttonSize}
        onClick={onEditClick}
      >
        프로필 수정
      </Button>
    </section>
  );
}
