import { HeartIcon, UserIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState } from 'react';

import { useFavoritesStore } from '@/stores/favoritesStore';

import type { IdolCardProps } from './card.types';

function IdolCard({
  imageSrc = '',
  title = '',
  detail,
  idolId,
  className,
  toggleFavorite,
  ...rest
}: IdolCardProps) {
  const { idolGroup, position } = detail;
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const { isFavorited } = useFavoritesStore();
  const useGlobal = Boolean(idolId);
  const liked = useGlobal ? isFavorited(idolId!) : isLiked;

  const handleClickLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (useGlobal && idolId !== undefined) toggleFavorite(idolId);
    else setIsLiked(prev => !prev);
  };

  return (
    <div
      className={clsx(
        'group relative h-89 w-72 cursor-pointer overflow-hidden rounded-lg bg-white shadow-2xl',
        className,
      )}
      {...rest}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={title}
          className="block h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-neutral-200">
          <UserIcon className="h-20 w-20 fill-neutral-100 text-neutral-500" />
        </div>
      )}

      <div className="transition-filter absolute inset-0 flex h-full w-full items-end rounded-lg bg-gradient-to-b from-transparent to-neutral-800 opacity-0 duration-300 ease-out group-hover:opacity-100">
        <button type="button" onClick={handleClickLike}>
          <HeartIcon
            className={clsx(
              'absolute top-2.75 right-3 z-10 h-12 w-12',
              liked
                ? 'fill-fuchsia-500 text-fuchsia-800'
                : 'fill-neutral-100 text-neutral-500',
            )}
          />
        </button>
        <div className="flex w-full flex-col gap-2 py-4 text-center opacity-0 transition-all duration-300 ease-out group-hover:opacity-100">
          <h4 className="text-lg font-semibold text-gray-100">{title}</h4>
          <div className="flex flex-col gap-1">
            <span className="text-base font-normal text-gray-200">
              그룹 : {idolGroup}
            </span>
            <span className="text-base font-normal text-gray-200">
              포지션 : {position}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IdolCard;
