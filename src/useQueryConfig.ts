import React, { useCallback } from 'react';
import { getContext } from './utils';
import type {
  QueryConfig,
  RequestConfig,
  RequestConfigAction,
  URLConfig,
  BaseURLConfig,
} from './types';
import _ from 'lodash';

export const useQueryConfig = (
  baseURLKey: string,
  urlKey?: string,
  contextId?: string
): [QueryConfig, (nextConfig: Partial<BaseURLConfig | URLConfig>) => void] => {
  const { config, setConfig } = React.useContext(getContext(contextId))!;
  const baseURLConfig = config[baseURLKey]!;

  const setQueryConfig = useCallback(
    (nextConfig: Partial<BaseURLConfig | URLConfig>) => {
      setConfig((prevConfig) => {
        const prevBaseURLConfig = prevConfig?.[baseURLKey];
        const prevURLConfig = urlKey
          ? prevBaseURLConfig?.[urlKey as keyof typeof prevBaseURLConfig]
          : undefined;

        //Update base URL config
        if (!prevURLConfig) {
          return {
            ...prevConfig,
            [baseURLKey]: _.merge(prevBaseURLConfig, nextConfig),
          };
        }

        //Update URL config
        if (typeof prevURLConfig === 'object') {
          return {
            ...prevConfig,
            [baseURLKey]: {
              ...prevBaseURLConfig,
              [urlKey!]: _.merge(prevURLConfig, nextConfig),
            },
          };
        } else {
          console.error(
            `${urlKey} config is not an object to be able to update it.`
          );

          return prevConfig;
        }
      });
    },
    [baseURLKey, urlKey, setConfig]
  );

  const getURL = () => {
    if (!urlKey) {
      return '';
    }

    const urlConfig = baseURLConfig[
      (urlKey as keyof typeof baseURLConfig) || ''
    ] as URLConfig;

    if (!urlConfig) {
      return '';
    }

    return typeof urlConfig === 'string' ? urlConfig : urlConfig.url;
  };

  const getRequestConfig = () => {
    let urlConfig = baseURLConfig[(urlKey as keyof typeof baseURLConfig) || ''];

    if (!urlConfig || typeof urlConfig === 'string') {
      return baseURLConfig?.requestConfig;
    }

    switch ((urlConfig as RequestConfigAction).requestConfigAction) {
      case 'OVERWRITE':
        return (urlConfig as RequestConfig).requestConfig;
      default:
        return _.merge(
          baseURLConfig.requestConfig,
          (urlConfig as RequestConfig).requestConfig
        );
    }
  };

  const queryConfig: QueryConfig = {
    baseURL: baseURLConfig.baseURL as string,
    requestConfig: getRequestConfig() as RequestConfig['requestConfig'],
    url: getURL() as string,
  };

  return [queryConfig, setQueryConfig];
};
