import React from 'react';

import { mediaQuery } from '@/constants/breakpoints';
import type { useDraggable } from '@/hooks/useDraggable';
import useMediaQuery from '@/hooks/useMediaQuery';

interface FavoriteSectionProps<T> {
  title: string;
  emptyMessage: string;
  items: T[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  events: ReturnType<typeof useDraggable>;
  renderItem: (item: T) => React.ReactNode;
  toggleFavorite: (id: number) => void;
}

export default function FavoriteSection<T>({
  title,
  emptyMessage,
  items,
  containerRef,
  events,
  renderItem,
}: FavoriteSectionProps<T>) {
  const isDesktop = useMediaQuery(mediaQuery.tablet);

  return (
    <div>
      <h3 className="pt-2 pb-4 text-center text-lg font-medium md:pt-0 md:text-start">
        {title}
      </h3>

      {items.length > 0 ? (
        <div
          className="flex w-full flex-col flex-wrap items-center gap-4 md:flex-row md:flex-nowrap md:overflow-x-auto"
          ref={containerRef}
          {...(isDesktop ? events : {})}
        >
          {items.map(item => renderItem(item))}
        </div>
      ) : (
        <div className="text-center text-gray-500">{emptyMessage}</div>
      )}
    </div>
  );
}
