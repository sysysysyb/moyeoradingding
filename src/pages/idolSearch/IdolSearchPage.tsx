import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBar from '@/components/common/SearchBar';
import { useDebounce } from '@/hooks/useDebounce';

import IdolSearchList from './IdolSearchList';
import {
  EmptySearchResult,
  ErrorMessage,
  FavoriteEmptyState,
  LoadingSpinner,
} from './IdolSearchStates';
import { useIdolSearch } from './useIdolSearch';

export default function IdolSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const navigate = useNavigate();

  const {
    idolsToDisplay,
    isLoading,
    isError,
    shouldShowEmptyState,
    shouldShowEmptyFavorites,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSearching,
    toggleFavorite,
  } = useIdolSearch(debouncedSearchQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCardClick = (id: number) => {
    navigate(`/idols/${id}`);
  };

  return (
    <div className="mx-auto box-border flex min-h-[calc(100svh-21rem)] w-full max-w-7xl flex-col px-4 pt-16 pb-20 md:px-8 lg:px-12 xl:px-16">
      <div className="mb-8 text-center md:mb-12">
        <h1 className="text-3xl font-bold md:text-4xl lg:mt-6 xl:mt-9">
          아이돌 스케줄 보기
        </h1>

        <div className="mx-auto mt-8 max-w-lg md:mt-10">
          <SearchBar
            inputValue={searchQuery}
            onInputChange={handleInputChange}
          />
        </div>

        {!isSearching && !shouldShowEmptyFavorites && !isLoading && (
          <p className="mt-6 text-sm text-gray-700 md:mt-8 md:text-base md:font-semibold">
            좋아하는 아이돌의 스케줄을 추가해보세요!
          </p>
        )}
      </div>

      <div className="mb-9 flex flex-grow flex-col">
        {isLoading && <LoadingSpinner />}

        {isError && <ErrorMessage />}

        {!isLoading && !isError && shouldShowEmptyFavorites && (
          <div className="mt-12 mb-14 md:mt-10 md:mb-20">
            <FavoriteEmptyState />
          </div>
        )}

        {shouldShowEmptyState && <EmptySearchResult />}

        {!isLoading && !isError && idolsToDisplay.length > 0 && (
          <IdolSearchList
            idols={idolsToDisplay}
            isSearching={isSearching}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onCardClick={handleCardClick}
            toggleFavorite={toggleFavorite}
          />
        )}
      </div>
    </div>
  );
}
