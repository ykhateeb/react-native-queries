import React, { useState, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getContext } from './utils';
import type { Config } from './types';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

interface Props {
  children: React.ReactNode;
  config: Config;
  contextId?: string;
}

export const QueriesProvider = (props: Props) => {
  const Context = useRef(getContext(props.contextId)).current!;
  const contextId = useRef(props.contextId).current;
  const [config, setConfig] = useState<Config>(props.config);

  return (
    <Context.Provider value={{ config, setConfig, contextId }}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </Context.Provider>
  );
};
