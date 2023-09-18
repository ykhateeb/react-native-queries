import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';
import Axios from './Axios';
import type { QueryConfig } from './types';

export interface UsePostOptions<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {}

export interface UsePostConfig extends QueryConfig {}

export const usePost = <TData = void, TError = void, TVariables = void>(
  config: UsePostConfig,
  options?: UsePostOptions<TData, TError, TVariables>
) => {
  return useMutation<TData, TError, TVariables>(async (data) => {
    const axiosInstance = Axios.getInstance(config.baseURL);

    const response = await axiosInstance.post<TData>(
      config.url,
      data,
      config.requestConfig
    );

    return response.data;
  }, options);
};
