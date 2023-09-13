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

type URLKeyType = undefined | string | string[];

type ReturnQueryConfig<T> = T extends undefined | string
  ? QueryConfig
  : QueryConfig[];

type UpdatedConfig =
  | Partial<BaseURLConfig | URLConfig>
  | Partial<BaseURLConfig | URLConfig>[];

export const useQueryConfig = <T extends URLKeyType = undefined>(
  baseURLKey: string,
  URLKey?: T,
  contextId?: string
): [ReturnQueryConfig<T>, (updatedConfig: UpdatedConfig) => void] => {
  const { config, setConfig } = React.useContext(getContext(contextId))!;
  const baseURLConfig = config[baseURLKey]!;

  const setQueryConfig = useCallback(
    (updatedConfig: UpdatedConfig) => {
      setConfig((prevConfig) => {
        if (Array.isArray(updatedConfig) && !Array.isArray(URLKey)) {
          console.error('URLKey must be an array');
          return prevConfig;
        }

        const updateBaseURLConfig = () =>
          //Update base URL config
          _.merge(prevConfig, {
            [baseURLKey]: updatedConfig,
          });

        const updateURLConfig = (
          key: string,
          updatedURLConfig: typeof updatedConfig
        ) => {
          const prevURLConfig = _.get(prevConfig, [
            baseURLKey,
            key,
          ]) as URLConfig;

          //Update URL config
          if (typeof prevURLConfig === 'object') {
            _.merge(prevConfig, {
              [baseURLKey]: { [key as string]: updatedURLConfig },
            });
          } else {
            console.error(
              `${key} config is not an object to be able to update it.`
            );
          }
        };

        if (URLKey) {
          const keysToUpdate = Array.isArray(URLKey)
            ? URLKey
            : [URLKey as string];

          if (Array.isArray(updatedConfig)) {
            for (let i = 0; i < updatedConfig.length; i++) {
              updateURLConfig(keysToUpdate[i]!, updatedConfig[i]!);
            }
          } else {
            for (const key of keysToUpdate) {
              updateURLConfig(key, updatedConfig);
            }
          }
        } else {
          updateBaseURLConfig();
        }

        return _.cloneDeep(prevConfig);
      });
    },
    [baseURLKey, URLKey, setConfig]
  );

  const getURL = (key?: string) => {
    if (!key) {
      return '';
    }

    const urlConfig = baseURLConfig[
      (key as keyof typeof baseURLConfig) || ''
    ] as URLConfig;

    if (!urlConfig) {
      return '';
    }

    return typeof urlConfig === 'string' ? urlConfig : urlConfig.url;
  };

  const getRequestConfig = (key?: string) => {
    const urlConfig = baseURLConfig[(key as keyof typeof baseURLConfig) || ''];

    if (!urlConfig || typeof urlConfig === 'string') {
      return baseURLConfig?.requestConfig;
    }

    const URLRequestConfig = (urlConfig as RequestConfig).requestConfig;

    if (
      (urlConfig as RequestConfigAction).requestConfigAction === 'OVERWRITE'
    ) {
      return URLRequestConfig;
    }

    return _.merge({}, baseURLConfig.requestConfig, URLRequestConfig);
  };

  const getQueryConfig = () => {
    if (Array.isArray(URLKey)) {
      const queriesConfigs: QueryConfig[] = [];

      for (const key of URLKey) {
        queriesConfigs.push({
          baseURL: baseURLConfig.baseURL as string,
          requestConfig: getRequestConfig(
            key
          ) as RequestConfig['requestConfig'],
          url: getURL(key) as string,
        });
      }

      return queriesConfigs as ReturnQueryConfig<T>;
    }

    const queryConfig: QueryConfig = {
      baseURL: baseURLConfig.baseURL as string,
      requestConfig: getRequestConfig(URLKey) as RequestConfig['requestConfig'],
      url: getURL(URLKey) as string,
    };

    return queryConfig as ReturnQueryConfig<T>;
  };

  return [getQueryConfig(), setQueryConfig];
};
