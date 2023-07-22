import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';
import Axios from './Axios';
import type { QueryConfig } from './types';

export interface UsePutOptions<TData, TError, TVariables>
  extends UseMutationOptions<TData, TError, TVariables> {}

interface UsePutConfig extends QueryConfig {}

export const usePut = <TData = void, TError = void, TVariables = void>(
  config: UsePutConfig,
  options?: UsePutOptions<TData, TError, TVariables>
) => {
  const result = useMutation<TData, TError, TVariables>(async (data) => {
    const axiosInstance = Axios.getInstance(config.baseURL);

    const response = await axiosInstance.put<TData>(
      config.url,
      data,
      config.requestConfig
    );

    return response.data;
  }, options);

  return result;
};
