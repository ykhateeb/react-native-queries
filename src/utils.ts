import React from 'react';
import type { ContextState, QueryConfig } from './types';

type Params = {
  [key: string]: string | number;
};
export const parseURL = (url: string, params: Params): string => {
  Object.keys(params).forEach((key) => {
    url = url.replace(`{{${key}}}`, `${params[key]}`);
  });

  return url;
};

export const parseConfigURL = (queryConfig: QueryConfig, params: Params) => {
  return {
    ...queryConfig,
    url: parseURL(queryConfig.url, params),
  };
};

export const replaceAt = (
  url: string,
  index: number,
  replacement: string | number
) =>
  url.substring(0, index) +
  replacement +
  url.substring(
    index +
      (typeof replacement === 'string'
        ? replacement.length
        : replacement.toString().length)
  );

export const getURLParamIndex = (url: string, paramKey: string) =>
  url.indexOf(`{{${paramKey}}}`);

export const isJSONString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

const contexts: { [key: string]: React.Context<ContextState> } = {};

export const getContext = (contextId: string = 'default') => {
  const currentContext: React.Context<ContextState> = contexts[contextId]!;

  if (currentContext) {
    return currentContext;
  }

  contexts[contextId] = React.createContext<ContextState>(null);

  return contexts[contextId]!;
};
