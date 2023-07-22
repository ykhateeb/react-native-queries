import { useQuery } from 'react-query';
import type { UseQueryOptions, QueryKey } from 'react-query';
import Axios from './Axios';
import type { QueryConfig } from './types';

export interface UseGetOptions<TData, TError>
  extends UseQueryOptions<TData, TError> {}

interface UseGetConfig extends QueryConfig {
  key: QueryKey;
}

export const useGet = <TData = void, TError = void>(
  config: UseGetConfig,
  options?: UseGetOptions<TData, TError>
) => {
  const result = useQuery<TData, TError>(
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

  return result;
};
