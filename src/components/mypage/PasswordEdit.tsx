import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/common/Button';
import Input from '@/components/common/input';
import { usePasswordEdit } from '@/hooks/usePasswordEdit';
import {
  type PasswordChangeFormValues,
  PasswordChangeSchema,
} from '@/schemas/passwordSchema';
import { handleEnterKey } from '@/utils/handleEnterKey';
import { toastFormErrors } from '@/utils/toastUtils';

interface PasswordEditProps {
  onCancelEdit: () => void;
}

const isMockDemo = import.meta.env.VITE_ENABLE_MSW === 'true';

export default function PasswordEdit({ onCancelEdit }: PasswordEditProps) {
  const {
    isVerified,
    isVerifying,
    isChanging,
    handleVerifyPassword,
    handleChangePassword,
  } = usePasswordEdit({ onCancelEdit });

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    mode: 'onBlur',
  });

  const { register, handleSubmit, getValues, trigger } = form;

  const onVerifyClick = async () => {
    const isCurrentPasswordValid = await trigger('currentPassword');
    if (isCurrentPasswordValid) {
      handleVerifyPassword(getValues('currentPassword'));
    }
  };

  return (
    <div className="w-full flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-md md:p-10">
      <h2 className="mb-6 text-2xl font-semibold">비밀번호 수정</h2>
      {isMockDemo && (
        <p className="mb-4 rounded-lg bg-fuchsia-50 px-4 py-3 text-sm text-fuchsia-700">
          현재 데모 비밀번호: test123!
        </p>
      )}
      <form
        onSubmit={handleSubmit(handleChangePassword, toastFormErrors)}
        className="flex flex-col gap-4"
      >
        <Input
          type="password"
          label="현재 비밀번호"
          {...register('currentPassword')}
          readOnly={isVerified}
          onKeyDown={handleEnterKey(onVerifyClick, !isVerified)}
        />

        {isVerified && (
          <>
            <Input
              type="password"
              label="새 비밀번호"
              {...register('newPassword')}
            />
            <Input
              type="password"
              label="새 비밀번호 확인"
              {...register('confirmNewPassword')}
            />
          </>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancelEdit}
            disabled={isVerifying || isChanging}
          >
            취소
          </Button>
          {!isVerified ? (
            <Button
              type="button"
              onClick={onVerifyClick}
              disabled={isVerifying}
            >
              현재 비밀번호 확인
            </Button>
          ) : (
            <Button type="submit" disabled={isChanging}>
              저장
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
