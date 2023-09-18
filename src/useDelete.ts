import { useMutation } from '@tanstack/react-query';
import Axios from './Axios';
import { parseURL } from './utils';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { QueryConfig } from './types';

export interface UseDeleteOptions<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {}

export interface UseDeleteConfig extends QueryConfig {}

export const useDelete = <TData = void, TError = void, TVariables = void>(
  config: UseDeleteConfig,
  options?: UseDeleteOptions<TData, TError, TVariables>
) => {
  return useMutation<TData, TError, TVariables>(
    async (data /** path params */) => {
      const axiosInstance = Axios.getInstance(config.baseURL);
      const response = await axiosInstance.delete<TData>(
        parseURL(config.url, (data || {}) as any),
        config.requestConfig
      );

      return response.data;
    },
    options
  );
};
