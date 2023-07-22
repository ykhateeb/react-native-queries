import axios from 'axios';
import type { AxiosInstance } from './types';

interface Instances {
  [key: string]: AxiosInstance;
}

const instances: Instances = {};

export const getInstance = (baseURL?: string): AxiosInstance => {
  if (!baseURL) {
    return axios;
  }

  const currentInstance = instances[baseURL];

  if (currentInstance) {
    return currentInstance;
  }

  instances[baseURL] = axios.create({ baseURL });

  return instances[baseURL]!;
};

export default {
  getInstance,
};
