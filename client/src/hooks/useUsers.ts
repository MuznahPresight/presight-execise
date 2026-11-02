import { useState, useEffect, useRef, useCallback } from 'react';
import type { UsersResponse, FilterState, UsersError } from '../types';

const SEARCH_DEBOUNCE_MS = 300;

interface KeyedData {
  key: string;
  response: UsersResponse;
}

interface KeyedError {
  key: string;
  error: UsersError;
}

export function useUsers(filters: FilterState) {
  const [data, setData] = useState<KeyedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<KeyedError | null>(null);
  const requestId = useRef(0);
  const inFlightRequest = useRef<string | null>(null);
  const errorQueryKey = useRef<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const queryParams = new URLSearchParams({
    search: filters.search,
    sortField: filters.sortField,
    sortDirection: filters.sortDirection,
  });
  filters.selectedNationalities.forEach(n => queryParams.append('nationality', n));
  filters.selectedHobbies.forEach(h => queryParams.append('hobby', h));
  const queryKey = queryParams.toString();
  const [pageState, setPageState] = useState({ key: queryKey, page: 1 });
  const page = pageState.key === queryKey ? pageState.page : 1;
  const activeQueryKey = useRef(queryKey);
  const requestedPage = useRef({ key: queryKey, page });
  activeQueryKey.current = queryKey;
  if (requestedPage.current.key !== queryKey) {
    requestedPage.current = { key: queryKey, page: 1 };
  } else if (requestedPage.current.page < page) {
    requestedPage.current.page = page;
  }

  useEffect(() => {
    if (filters.search === debouncedSearch) return;

    const timeout = window.setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [filters.search, debouncedSearch]);

  const visibleData = data?.key === queryKey ? data.response : null;
  const staleData = visibleData ? null : data?.response ?? null;
  const error = requestError?.key === queryKey ? requestError.error : null;
  const isDebouncingSearch = filters.search !== debouncedSearch;
  const hasMore = visibleData?.hasMore ?? false;

  useEffect(() => {
    const currentRequest = ++requestId.current;
    if (isDebouncingSearch) {
      inFlightRequest.current = null;
      return;
    }

    const controller = new AbortController();
    inFlightRequest.current = queryKey;
    errorQueryKey.current = null;
    setLoading(true);
    setRequestError(null);

    const fetchUsers = async () => {
      try {
        const params = new URLSearchParams(queryKey);
        params.set('search', debouncedSearch);
        params.set('page', String(page));
        params.set('limit', '20');

        const response = await fetch(`/api/users?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          if (currentRequest === requestId.current) {
            errorQueryKey.current = queryKey;
            setRequestError({
              key: queryKey,
              error: response.status === 400 || response.status === 422
                ? 'invalid_filters'
                : 'service',
            });
          }
          return;
        }

        const result: UsersResponse = await response.json();
        if (currentRequest !== requestId.current) return;

        setData(previous => {
          const previousResponse = previous?.key === queryKey ? previous.response : null;
          return {
            key: queryKey,
            response: page === 1 || !previousResponse
              ? result
              : { ...result, items: [...previousResponse.items, ...result.items] },
          };
        });
      } catch (err) {
        if (!controller.signal.aborted && currentRequest === requestId.current) {
          errorQueryKey.current = queryKey;
          setRequestError({
            key: queryKey,
            error: err instanceof TypeError ? 'connection' : 'service',
          });
        }
      } finally {
        if (currentRequest === requestId.current) {
          inFlightRequest.current = null;
          setLoading(false);
        }
      }
    };
    void fetchUsers();
    return () => {
      controller.abort();
      requestId.current += 1;
      if (inFlightRequest.current === queryKey) {
        inFlightRequest.current = null;
      }
    };
  }, [page, retryCount, debouncedSearch, isDebouncingSearch, queryKey]);

  const loadMore = useCallback(() => {
    if (
      queryKey !== activeQueryKey.current
      || !hasMore
      || loading
      || error
      || inFlightRequest.current !== null
      || errorQueryKey.current === queryKey
      || isDebouncingSearch
      || requestedPage.current.key !== queryKey
      || requestedPage.current.page !== page
    ) {
      return;
    }
    const nextPage = page + 1;
    requestedPage.current.page = nextPage;
    setPageState({ key: queryKey, page: nextPage });
  }, [queryKey, hasMore, loading, error, isDebouncingSearch, page]);

  return {
    data: visibleData ?? staleData,
    isRefreshing: staleData !== null,
    loading: loading || isDebouncingSearch || (!visibleData && !error),
    isLoadingMore: loading && page > 1,
    hasMore,
    loadMore,
    error,
    retry: () => setRetryCount(count => count + 1),
  };
}
