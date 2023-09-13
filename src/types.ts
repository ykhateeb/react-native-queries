import type { AxiosInstance, AxiosRequestConfig } from 'axios';

type BaseURL = { baseURL: string };
type URL = { url: string };
export type RequestConfig = {
  requestConfig?: Omit<AxiosRequestConfig, 'baseURL' | 'url' | 'params'>;
};
export type RequestConfigAction = {
  requestConfigAction?: 'MERGE' | 'OVERWRITE';
};

/**
 * Configuration for a URL.
 * @property {URL} url - The URL to configure.
 * @property {RequestConfig} [requestConfig] - The config to merge or overwrite with base requestConfig.
 * @property {RequestConfigAction} [requestConfigAction] - The action to take with the base requestConfig.
 * @default 'MERGE'
 */
export type URLConfig = string | (URL & RequestConfig & RequestConfigAction);

/**
 * Configuration for a base URL.
 * @property {URL} baseURL - The base URL to configure.
 * @property {RequestConfig} [requestConfig] - The config to use for the base URL and all the url children with string type.
 * @property {URLConfig} [key] - URLs to configure relative to the base URL.
 */
export type BaseURLConfig =
  | (BaseURL & RequestConfig)
  | Record<string, URLConfig>;

/**
 * A configuration for multiple base URLs.
 * @property {BaseURLConfig} [key] - The configuration for a base URL.
 */
export type Config = Record<string, BaseURLConfig>;

/**
 * Configuration for a query.
 * @property {string} baseURL - The base URL to use for the query.
 * @property {URL} url - The URL to query.
 * @property {RequestConfig} [requestConfig] - The config to use for the query.
 */
export type QueryConfig = BaseURL & URL & RequestConfig;

export type { AxiosInstance };

/**
 * The state of the context.
 * @property {Config} config - The configuration for the context.
 * @property {React.Dispatch<React.SetStateAction<Config>>} setConfig - A function to update the configuration.
 * @property {string} [contextId] - The ID of the context.
 */
export type ContextState = {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
  contextId?: string;
} | null;
