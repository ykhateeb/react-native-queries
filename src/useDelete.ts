import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';
import Axios from './Axios';
import type { QueryConfig } from './types';

export interface UseDeleteOptions<TData, TError, TVariables>
  extends UseMutationOptions<TData, TError, TVariables> {}

interface UseDeleteConfig extends QueryConfig {}

export const useDelete = <TData = void, TError = void, TVariables = void>(
  config: UseDeleteConfig,
  options?: UseDeleteOptions<TData, TError, TVariables>
) => {
  const result = useMutation<TData, TError, TVariables>(async (_data) => {
    const axiosInstance = Axios.getInstance(config.baseURL);

    const response = await axiosInstance.delete<TData>(
      config.url,
      config.requestConfig
    );

    return response.data;
  }, options);

  return result;
};
