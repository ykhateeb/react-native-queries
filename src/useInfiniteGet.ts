import { useInfiniteQuery } from 'react-query';
import type { UseInfiniteQueryOptions, QueryKey } from 'react-query';
import Axios from './Axios';
import type { QueryConfig } from './types';
import { parseURL } from './utils';

export interface UseInfiniteGetOptions<TData, TError>
  extends Omit<
    UseInfiniteQueryOptions<TData, TError>,
    'queryKey' | 'queryFn'
  > {}

export interface UseInfiniteGetConfig extends QueryConfig {
  key: QueryKey;
  /**
   * Param of page
   * ex: page number
   */
  pageParam: number | string;
  /**
   * Size of page
   */
  pageSize: number;
}

export const useInfiniteGet = <TData = void, TError = void>(
  config: UseInfiniteGetConfig,
  options?: UseInfiniteGetOptions<TData, TError>
) => {
  return useInfiniteQuery<TData, TError>(
    config.key,
    async (params) => {
      const axiosInstance = Axios.getInstance(config.baseURL);

      const response = await axiosInstance.get<TData>(
        parseURL(config.url, {
          pageParam: params.pageParam || config.pageParam,
          pageSize: config.pageSize,
        }),
        config.requestConfig
      );

      return response.data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          (lastPage as TData[])?.length === config.pageSize
            ? allPages.length + 1
            : undefined;

        return nextPage;
      },
      ...(options || {}),
    }
  );
};
