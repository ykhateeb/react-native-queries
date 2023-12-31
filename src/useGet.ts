import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, QueryKey } from '@tanstack/react-query';
import Axios from './Axios';
import type { QueryConfig } from './types';

export interface UseGetOptions<TData, TError>
  extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {}

export interface UseGetConfig extends QueryConfig {
  key: QueryKey;
}

export const useGet = <TData = void, TError = void>(
  config: UseGetConfig,
  options?: UseGetOptions<TData, TError>
) => {
  return useQuery<TData, TError>(
    config.key,
    async (_params) => {
      const axiosInstance = Axios.getInstance(config.baseURL);

      const response = await axiosInstance.get<TData>(
        config.url,
        config.requestConfig
      );

      return response.data;
    },
    options
  );
};
