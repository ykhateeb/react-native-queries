import { useMutation } from 'react-query';
import type { UseMutationOptions } from 'react-query';
import Axios from './Axios';
import type { QueryConfig } from './types';

export interface UsePatchOptions<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {}

export interface UsePatchConfig extends QueryConfig {}

export const usePatch = <TData = void, TError = void, TVariables = void>(
  config: UsePatchConfig,
  options?: UsePatchOptions<TData, TError, TVariables>
) => {
  const result = useMutation<TData, TError, TVariables>(async (data) => {
    const axiosInstance = Axios.getInstance(config.baseURL);

    const response = await axiosInstance.patch<TData>(
      config.url,
      data,
      config.requestConfig
    );

    return response.data;
  }, options);

  return result;
};
