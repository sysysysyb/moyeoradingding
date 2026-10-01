import { useState } from 'react';

import { logoutUser } from '@/api/authApi';
import { Button } from '@/components/common/Button';
import Modal from '@/components/common/modal/Modal';
import { usePageNav } from '@/hooks/usePageNav';
import { useUserStore } from '@/stores/userStore';
import { showErrorToast } from '@/utils/toastUtils';

export const useLogout = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { logout } = useUserStore();
  const { navigateToLanding } = usePageNav();

  const handleLogout = () => setIsConfirmOpen(true);

  const confirmLogout = async () => {
    setIsConfirmOpen(false);
    try {
      await logoutUser();
    } catch {
      showErrorToast('서버 로그아웃 처리 중 오류가 발생했습니다.');
    } finally {
      logout();
      navigateToLanding();
    }
  };

  const confirmationDialog = (
    <Modal
      isOpen={isConfirmOpen}
      onClose={() => setIsConfirmOpen(false)}
      title="로그아웃"
    >
      <p className="pb-6">로그아웃 하시겠습니까?</p>
      <div className="flex gap-4">
        <Button onClick={confirmLogout}>로그아웃</Button>
        <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
          취소
        </Button>
      </div>
    </Modal>
  );

  return { handleLogout, confirmationDialog };
};
