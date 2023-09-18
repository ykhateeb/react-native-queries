[useMutation]: https://tanstack.com/query/latest/docs/react/reference/useMutation
[useQuery]: https://tanstack.com/query/latest/docs/react/reference/useQuery
[useInfiniteQuery]: https://tanstack.com/query/latest/docs/react/reference/useInfiniteQuery

# react-native-queries

[![npm](https://img.shields.io/npm/v/react-native-queries?link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Freact-native-queries)](https://www.npmjs.com/package/react-native-queries)
[![npm](https://img.shields.io/npm/dm/react-native-queries)](https://www.npmjs.com/package/react-native-queries)
![GitHub](https://img.shields.io/github/license/ykhateeb/react-native-queries)
[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/ykhateeb/react-native-queries/ci.yml)](https://github.com/ykhateeb/react-native-queries/actions/workflows/ci.yml)

Simple and efficient library that empowers you to effortlessly handle HTTP requests in your React/React Native applications. It leverages the power of the widely-used [react-query](https://github.com/TanStack/query) and [axios](https://github.com/axios/axios) libraries, providing a robust set of hooks that streamline the process of fetching and managing data in your application.

## Installation

NPM

```sh
npm install react-native-queries
```

Yarn

```sh
yarn add react-native-queries
```

## Table of Contents

- [Quick Start](#quick-start)
- [Explanations](#explanations)
  - [config](#config)
  - [useQueryConfig](#usequeryconfig)
  - [useGet](#useget)
  - [useInfiniteGet](#useinfiniteget)
  - [usePost](#usepost)
  - [usePut](#useput)
  - [usePatch](#usepatch)
  - [useDelete](#usedelete)
  - [parseConfigURL](#parseconfigurl)

## Quick Start

```jsx
import React, { useEffect } from 'react';
import {
  QueriesProvider,
  useQueryClient,
  useQueryConfig,
  useGet,
  useInfiniteGet,
  usePost,
  usePut,
  usePatch,
  useDelete,
  parseConfigURL,
} from 'react-native-queries';

/**
 * Fake Post
 */
const useFakePost = (id, options) => {
  const [fakePostConfig] = useQueryConfig('jsonplaceholder', 'fakePost');
  return useGet(
    {
      key: ['FAKE_POST', id],
      ...parseConfigURL(fakePostConfig, { id }),
    },
    options
  );
};

/**
 * Fake Posts
 */
const useFakePosts = (options) => {
  const [fakePostsConfig] = useQueryConfig('jsonplaceholder', 'fakePosts');
  return useGet(
    {
      key: 'FAKE_POSTS',
      ...fakePostsConfig,
    },
    options
  );
};

/**
 * Filtered Fake Posts
 */
const useFilteredFakePosts = (userId, options) => {
  const [filteredFakePostsConfig] = useQueryConfig(
    'jsonplaceholder',
    'filteredFakePosts'
  );
  return useGet(
    {
      key: ['FILTERED_FAKE_POSTS', userId],
      ...parseConfigURL(filteredFakePostsConfig, { userId }),
    },
    options
  );
};

/**
 * Fake Posts Pages
 */
const useFakePostsPages = (options) => {
  const [fakePostsPagesConfig] = useQueryConfig(
    'jsonplaceholder',
    'fakePostsPages'
  );
  return useInfiniteGet(
    {
      key: 'FAKE_POSTS_PAGES',
      pageParam: 1,
      pageSize: 10,
      ...fakePostsPagesConfig,
    },
    options
  );
};

/**
 * Create Fake Post
 */
const useCreateFakePost = (options) => {
  const [createFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'createFakePost'
  );
  return usePost(createFakePostConfig, options);
};

/**
 * Update Fake Post
 */
const useUpdateFakePost = (id, options) => {
  const [updateFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'updateFakePost'
  );
  return usePut(parseConfigURL(updateFakePostConfig, { id }), options);
};

/**
 * Patch Fake Post
 */
const usePatchFakePost = (id, options) => {
  const [patchFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'patchFakePost'
  );
  return usePatch(parseConfigURL(patchFakePostConfig, { id }), options);
};

/**
 * Delete Fake Post
 */
const useDeleteFakePost = (options) => {
  const [deleteFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'deleteFakePost'
  );
  return useDelete(deleteFakePostConfig, options);
};

const Content = () => {
  const queryClient = useQueryClient();

  useFakePost(1, {
    onSuccess: (data) => {
      console.log('fakePostData: ', data);
    },
  });

  useFakePosts({
    onSuccess: (data) => {
      console.log('fakePostsData: ', data);
    },
  });

  const filteredFakePosts = useFilteredFakePosts(1);

  const fakePostsPages = useFakePostsPages({
    onSuccess: (data) => {
      console.log('fakePostsPagesData: ', data);
    },
  });

  useEffect(() => {
    console.log('filteredFakePostsData: ', filteredFakePosts.data);
  }, [filteredFakePosts.data]);

  const createFakePost = useCreateFakePost({
    onSuccess: (data) => {
      console.log('createFakePostData: ', data);
      //refresh FilteredFakePosts and FakePosts queries
      queryClient.invalidateQueries({
        queryKey: ['FILTERED_FAKE_POSTS', 'FAKE_POSTS'],
      });
    },
  });

  const updateFakePost = useUpdateFakePost(1, {
    onSuccess: (data) => {
      console.log('updateFakePostData: ', data);
      //refresh FakePost query
      queryClient.invalidateQueries({ queryKey: ['FAKE_POST'] });
    },
  });

  const patchFakePost = usePatchFakePost(1, {
    onSuccess: (data) => {
      console.log('patchFakePostData: ', data);
    },
  });

  const deleteFakePost = useDeleteFakePost({
    onSuccess: (data) => {
      console.log('deleteFakePostData: ', data);
    },
  });

  useEffect(() => {
    createFakePost.mutate({
      title: 'foo',
      body: 'bar',
      userId: 1,
    });

    updateFakePost.mutate({
      id: 1,
      title: 'foo',
      body: 'bar',
      userId: 1,
    });

    patchFakePost.mutate({ title: 'foo' });

    deleteFakePost.mutate({ id: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fakePostsPages.isFetchedAfterMount && fakePostsPages.fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fakePostsPages.isFetchedAfterMount, fakePostsPages.fetchNextPage]);

  return null;
};

export default function App() {
  return (
    <QueriesProvider
      config={{
        jsonplaceholder: {
          baseURL: 'https://jsonplaceholder.typicode.com',
          fakePosts: 'posts',
          fakePost: 'posts/{{id}}',
          filteredFakePosts: 'posts?userId={{userId}}',
          fakePostsPages: 'posts?_page={{pageParam}}&_limit={{pageSize}}', //pageParam(page number here) and pageSize are mandatory, must be added with same name to be able to update query to next page.
          createFakePost: 'posts',
          updateFakePost: 'posts/{{id}}',
          patchFakePost: 'posts/{{id}}',
          deleteFakePost: 'posts/{{id}}',
        },
      }}
    >
      <Content />
    </QueriesProvider>
  );
}
```

<details>
<summary><b>Typescript</b></summary>

```tsx
import React, { useEffect } from 'react';
import {
  QueriesProvider,
  useQueryClient,
  useQueryConfig,
  useGet,
  useInfiniteGet,
  usePost,
  usePut,
  usePatch,
  useDelete,
  parseConfigURL,
} from 'react-native-queries';
import type {
  UseGetOptions,
  UseInfiniteGetOptions,
  UsePostOptions,
  UsePutOptions,
  UsePatchOptions,
  UseDeleteOptions,
} from 'react-native-queries';

/**
 * Fake Post
 */
interface FakePostData {
  body: string;
  id: number;
  title: string;
  userId: number;
}
interface FakePostError {}

const useFakePost = (
  id: number,
  options?: UseGetOptions<FakePostData, FakePostError>
) => {
  const [fakePostConfig] = useQueryConfig('jsonplaceholder', 'fakePost');
  return useGet<FakePostData, FakePostError>(
    {
      key: ['FAKE_POST', id],
      ...parseConfigURL(fakePostConfig, { id }),
    },
    options
  );
};

/**
 * Fake Posts
 */
type FakePostsData = FakePostData[];
interface FakePostsError {}

const useFakePosts = (
  options?: UseGetOptions<FakePostsData, FakePostsError>
) => {
  const [fakePostsConfig] = useQueryConfig('jsonplaceholder', 'fakePosts');
  return useGet<FakePostsData, FakePostsError>(
    {
      key: 'FAKE_POSTS',
      ...fakePostsConfig,
    },
    options
  );
};

/**
 * Filtered Fake Posts
 */
type FilteredFakePostsData = FakePostData[];
interface FilteredFakePostsError {}

const useFilteredFakePosts = (
  userId: number,
  options?: UseGetOptions<FilteredFakePostsData, FilteredFakePostsError>
) => {
  const [filteredFakePostsConfig] = useQueryConfig(
    'jsonplaceholder',
    'filteredFakePosts'
  );
  return useGet<FilteredFakePostsData, FilteredFakePostsError>(
    {
      key: ['FILTERED_FAKE_POSTS', userId],
      ...parseConfigURL(filteredFakePostsConfig, { userId }),
    },
    options
  );
};

/**
 * Fake Posts Pages
 */
type FakePostsPagesData = FakePostData[];
interface FakePostsPagesError {}

const useFakePostsPages = (
  options?: UseInfiniteGetOptions<FakePostsPagesData, FakePostsPagesError>
) => {
  const [fakePostsPagesConfig] = useQueryConfig(
    'jsonplaceholder',
    'fakePostsPages'
  );
  return useInfiniteGet<FakePostsPagesData, FakePostsPagesError>(
    {
      key: 'FAKE_POSTS_PAGES',
      pageParam: 1,
      pageSize: 10,
      ...fakePostsPagesConfig,
    },
    options
  );
};

/**
 * Create Fake Post
 */
interface CreateFakePostData extends FakePostData {}
interface CreateFakePostError {}
interface CreateFakePostVariables {
  title: string;
  body: string;
  userId: number;
}

const useCreateFakePost = (
  options?: UsePostOptions<
    CreateFakePostData,
    CreateFakePostError,
    CreateFakePostVariables
  >
) => {
  const [createFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'createFakePost'
  );
  return usePost<
    CreateFakePostData,
    CreateFakePostError,
    CreateFakePostVariables
  >(createFakePostConfig, options);
};

/**
 * Update Fake Post
 */
interface UpdateFakePostData extends FakePostData {}
interface UpdateFakePostError {}
interface UpdateFakePostVariables {
  title: string;
  body: string;
  userId: number;
  id: number;
}

const useUpdateFakePost = (
  id: number,
  options?: UsePutOptions<
    UpdateFakePostData,
    UpdateFakePostError,
    UpdateFakePostVariables
  >
) => {
  const [updateFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'updateFakePost'
  );
  return usePut<
    UpdateFakePostData,
    UpdateFakePostError,
    UpdateFakePostVariables
  >(parseConfigURL(updateFakePostConfig, { id }), options);
};

/**
 * Patch Fake Post
 */
interface PatchFakePostData extends FakePostData {}
interface PatchFakePostError {}
interface PatchFakePostVariables {
  title: string;
}

const usePatchFakePost = (
  id: number,
  options?: UsePatchOptions<
    PatchFakePostData,
    PatchFakePostError,
    PatchFakePostVariables
  >
) => {
  const [patchFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'patchFakePost'
  );
  return usePatch<
    PatchFakePostData,
    PatchFakePostError,
    PatchFakePostVariables
  >(parseConfigURL(patchFakePostConfig, { id }), options);
};

/**
 * Delete Fake Post
 */
interface DeleteFakePostData {}
interface DeleteFakePostError {}
interface DeleteFakePostVariables {
  id: number;
}

const useDeleteFakePost = (
  options?: UseDeleteOptions<
    DeleteFakePostData,
    DeleteFakePostError,
    DeleteFakePostVariables
  >
) => {
  const [deleteFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'deleteFakePost'
  );
  return useDelete<
    DeleteFakePostData,
    DeleteFakePostError,
    DeleteFakePostVariables
  >(deleteFakePostConfig, options);
};

const Content = () => {
  const queryClient = useQueryClient();

  useFakePost(1, {
    onSuccess: (data) => {
      console.log('fakePostData: ', data);
    },
  });

  useFakePosts({
    onSuccess: (data) => {
      console.log('fakePostsData: ', data);
    },
  });

  const filteredFakePosts = useFilteredFakePosts(1);

  const fakePostsPages = useFakePostsPages({
    onSuccess: (data) => {
      console.log('fakePostsPagesData: ', data);
    },
  });

  useEffect(() => {
    console.log('filteredFakePostsData: ', filteredFakePosts.data);
  }, [filteredFakePosts.data]);

  const createFakePost = useCreateFakePost({
    onSuccess: (data) => {
      console.log('createFakePostData: ', data);
      //refresh FilteredFakePosts and FakePosts queries
      queryClient.invalidateQueries({
        queryKey: ['FILTERED_FAKE_POSTS', 'FAKE_POSTS'],
      });
    },
  });

  const updateFakePost = useUpdateFakePost(1, {
    onSuccess: (data) => {
      console.log('updateFakePostData: ', data);
      //refresh FakePost query
      queryClient.invalidateQueries({ queryKey: ['FAKE_POST'] });
    },
  });

  const patchFakePost = usePatchFakePost(1, {
    onSuccess: (data) => {
      console.log('patchFakePostData: ', data);
    },
  });

  const deleteFakePost = useDeleteFakePost({
    onSuccess: (data) => {
      console.log('deleteFakePostData: ', data);
    },
  });

  useEffect(() => {
    createFakePost.mutate({
      title: 'foo',
      body: 'bar',
      userId: 1,
    });

    updateFakePost.mutate({
      id: 1,
      title: 'foo',
      body: 'bar',
      userId: 1,
    });

    patchFakePost.mutate({ title: 'foo' });

    deleteFakePost.mutate({ id: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fakePostsPages.isFetchedAfterMount && fakePostsPages.fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fakePostsPages.isFetchedAfterMount, fakePostsPages.fetchNextPage]);

  return null;
};

export default function App() {
  return (
    <QueriesProvider
      config={{
        jsonplaceholder: {
          baseURL: 'https://jsonplaceholder.typicode.com',
          fakePosts: 'posts',
          fakePost: 'posts/{{id}}',
          filteredFakePosts: 'posts?userId={{userId}}',
          //pageParam(page number here) and pageSize are mandatory to set,to be able to update query to next page.
          fakePostsPages: 'posts?_page={{pageParam}}&_limit={{pageSize}}',
          createFakePost: 'posts',
          updateFakePost: 'posts/{{id}}',
          patchFakePost: 'posts/{{id}}',
          deleteFakePost: 'posts/{{id}}',
        },
      }}
    >
      <Content />
    </QueriesProvider>
  );
}
```

</details>

# Explanations

### `config`

Main configuration object that represents the structure of queries, start by adding `QueriesProvider` to your root app and pass `config` object with the following structure:

```javascript
/**
 * Structure
 */
const configStructure = {
  ['baseURLKey']: {
    baseURL: 'baseURLValue',
    requestConfig: AxiosRequestConfig,
    ['URLKey']:
      'URLValue' |
      {
        url: 'URLValue',
        requestConfig: AxiosRequestConfig,
        requestConfigAction: 'MERGE' | 'OVERWRITE',
      },
  },
  // more servers...
};

/**
 * Example:
 */
const config = {
  jsonplaceholder: {
    baseURL: 'https://jsonplaceholder.typicode.com',
    //will be applied to all queries except where requestConfigAction is OVERWRITE
    requestConfig: {
      headers: {
        sharedHeader: '...',
      },
    },
    fakePosts: 'posts',
    fakePost: 'posts/{{id}}',
    filteredFakePosts: { url: 'posts?userId={{userId}}' },
    createFakePost: { url: 'posts' },
    updateFakePost: {
      url: 'posts/{{id}}',
      requestConfigAction: 'OVERWRITE',
      //will overwrite baseURL requestConfig
      requestConfig: {
        headers: {
          specificHeader1: '...',
        },
      },
    },
    patchFakePost: {
      url: 'posts/{{id}}',
      //will be merged with baseURL requestConfig, since requestConfigAction default is MERGE
      //ex: requestConfig: { headers: { specificHeader2: '...' , sharedHeader: '...'} }
      requestConfig: {
        headers: {
          specificHeader2: '...',
        },
      },
    },
    deleteFakePost: 'posts/{{id}}',
  },
  jsonplaceholder2: {
    //...
  },
};

const App = () => {
  return <QueriesProvider config={config}>...</QueriesProvider>;
};
```

<details>
  <summary>
    <b>Typescript</b>
  </summary>

```typescript
interface Config {
  [baseURLKey: string]: {
    baseURL: string;
    requestConfig: AxiosRequestConfig;
    [URLKey: string]:
      | string
      | {
          url: string;
          requestConfig: AxiosRequestConfig;
          requestConfigAction?: 'MERGE' | 'OVERWRITE';
        };
  };
}
```

</details>
</br>

`- baseURLKey:` Name of the server.

`- baseURLValue:` Base server URL that will be prepended to every `URLValue`.

`- requestConfig:` [AxiosRequestConfig](https://axios-http.com/docs/req_config) to use with every query, except `baseURL`, `url` and `method`.

`- URLKey:` Name of URL(endpoint).

`- URLValue:` API URL(endpoint).

`- requestConfigAction:` The action to take with the base `requestConfig`, default is `MERGE`.

---

### `useQueryConfig`

Hook to get and update query config.

```javascript
const [queryConfig, setQueryConfig] = useQueryConfig('baseURLKey', 'URLKey');

const { baseURL, url, requestConfig } = queryConfig;

setQueryConfig({
  requestConfig: {
    //...
  },
});

/**
 * Example:
 */
import React, { useEffect } from 'react';
import { QueriesProvider, useQueryConfig } from 'react-native-queries';

const Content = () => {
  //Access shared queries config
  const [jsonplaceholderConfig, setJsonplaceholderConfig] =
    useQueryConfig('jsonplaceholder');

  //Access specific query config
  const [createFakePostConfig, setCreateFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'createFakePost'
  );

  // Access multiple queries config
  const [multipleFakePostConfig, setMultipleFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    ['createFakePost', 'patchFakePost']
  );
  // const [createFakePostConfig, patchFakePostConfig] = multipleFakePostConfig;

  useEffect(() => {
    //Set requestConfig to all queries
    setJsonplaceholderConfig({
      requestConfig: {
        headers: {
          sharedHeader: '...',
        },
      },
    });

    /**
     * Set requestConfig to specific query and merge with baseURL requestConfig.
     * note: to set requestConfig to specific query, url value must be an object in config.
     * ex: createFakePost:{url: 'posts'}
     */
    setCreateFakePostConfig({
      requestConfig: {
        headers: {
          specificHeader1: '...',
        },
      },
    });

    //Form 1: Set requestConfig for multiple queries
    setMultipleFakePostConfig({
      requestConfig: {
        headers: {
          specificHeader2: '...',
        },
      },
    });

    /**
     * Form 2: Set requestConfig as individual .
     * note: make sure to follow same order of urls keys: ['createFakePost', 'patchFakePost']
     */
    setMultipleFakePostConfig([
      {
        requestConfig: {
          headers: {
            specificHeader3: '...',
          },
        },
      },
      {
        requestConfig: {
          headers: {
            specificHeader4: '...',
          },
        },
      },
    ]);
  }, [
    setCreateFakePostConfig,
    setJsonplaceholderConfig,
    setMultipleFakePostConfig,
  ]);

  return null;
};

const App = () => {
  return (
    <QueriesProvider config={config}>
      <Content />
    </QueriesProvider>
  );
};
```

---

### `useGet`

A wrapper around [useQuery] hook.

```javascript
import { useQueryConfig, useGet, parseConfigURL } from 'react-native-queries';

const getConfig = {
  key: '...', //mandatory
  baseURL: '...',
  url: '...',
  requestConfig: '...',
};

const getOptions = {
  onSuccess: (data) => {},
  onError: (error) => {},
  //...
};

const getReturns = useGet(getConfig, getOptions);

/**
 * Example:
 */
const useFakePost = (id, options) => {
  const [fakePostConfig] = useQueryConfig('jsonplaceholder', 'fakePost');
  return useGet(
    {
      key: ['FAKE_POST', id],
      ...parseConfigURL(fakePostConfig, { id }),
    },
    options
  );
};

const { data, error, ...rest } = useFakePost(1, {
  onSuccess: (data) => {
    console.log('fakePostData: ', data);
  },
});
```

<details>
<summary><b>Typescript</b></summary>

```typescript
import { useQueryConfig, useGet, parseConfigURL } from 'react-native-queries';
import type { UseGetConfig, UseGetOptions } from 'react-native-queries';

interface GetData {}
interface GetError {}

const getConfig: UseGetConfig = {
  key: '...', //mandatory
  baseURL: '...',
  url: '...',
  requestConfig: '...',
};

const getOptions: UseGetOptions<GetData, GetError> = {
  onSuccess: (data) => {},
  onError: (error) => {},
  //...
};

const getReturns = useGet<GetData, GetError>(getConfig, getOptions);

/**
 * Example:
 */
interface FakePostData {
  body: string;
  id: number;
  title: string;
  userId: number;
}
interface FakePostError {}

const useFakePost = (
  id: number,
  options?: UseGetOptions<FakePostData, FakePostError>
) => {
  const [fakePostConfig] = useQueryConfig('jsonplaceholder', 'fakePost');
  return useGet<FakePostData, FakePostError>(
    {
      key: ['FAKE_POST', id],
      ...parseConfigURL(fakePostConfig, { id }),
    },
    options
  );
};

const { data, error, ...rest } = useFakePost(1, {
  onSuccess: (data) => {
    console.log('fakePostData: ', data);
  },
});
```

</details>

<br/>

`- getOptions:` [useQuery] options,
expect `queryKey`(mapped to `key` in `getConfig`) and `queryFn`.

`- getReturns:` [useQuery] returns.

---

### `useInfiniteGet`

A wrapper around [useInfiniteQuery] hook.

```javascript
import { useQueryConfig, useInfiniteGet } from 'react-native-queries';

const infiniteGetConfig = {
  key: '...', // mandatory
  /**
   * pageSize and pageParam are mandatory, they will be mapped to it's place in url
   * ex: 'posts?_page={{pageParam}}&_limit={{pageSize}}'
   */
  pageSize: '...',
  pageParam: '...',
  baseURL: '...',
  url: '...',
  requestConfig: '...',
};

const infiniteGetOptions = {
  onSuccess: (data) => {},
  onError: (error) => {},
  getNextPageParam: (lastPage, allPages) => {},
  getPreviousPageParam: (firstPage, allPages) => {},
  //...
};

const infiniteGetReturns = useInfiniteGet(
  infiniteGetConfig,
  infiniteGetOptions
);

fakePostsPages.fetchNextPage();
// OR manually specify pageParam
fakePostsPages.fetchNextPage({ pageParam: 2 });

// Note: passing getNextPageParam will override default implementation, which is based on increasing pageParam by 1 on every fetchNextPage call till finish all pages, in that case you need to provide your own implementation

/**
 * Example:
 */
const useFakePostsPages = (options) => {
  const [fakePostsPagesConfig] = useQueryConfig(
    'jsonplaceholder',
    'fakePostsPages'
  );
  return useInfiniteGet(
    {
      key: 'FAKE_POSTS_PAGES',
      pageParam: 1,
      pageSize: 10,
      ...fakePostsPagesConfig,
    },
    options
  );
};

const { data, error, fetchNextPage, ...rest } = useFakePostsPages({
  onSuccess: (data) => {
    console.log('fakePostsPagesData: ', data);
  },
});

fetchNextPage();
```

<details>
<summary><b>Typescript</b></summary>

```typescript
import { useQueryConfig, useInfiniteGet } from 'react-native-queries';
import type {
  UseInfiniteGetConfig,
  UseInfiniteGetOptions,
} from 'react-native-queries';

interface InfiniteGetData {}
interface InfiniteGetError {}

const infiniteGetConfig: UseInfiniteGetConfig = {
  key: '...', // mandatory
  /**
   * pageSize and pageParam are mandatory, they will be mapped to it's place in url
   * ex: 'posts?_page={{pageParam}}&_limit={{pageSize}}'
   */
  pageSize: '...',
  pageParam: '...',
  baseURL: '...',
  url: '...',
  requestConfig: '...',
};

const infiniteGetOptions: UseInfiniteGetOptions<
  InfiniteGetData,
  InfiniteGetError
> = {
  onSuccess: (data) => {},
  onError: (error) => {},
  getNextPageParam: (lastPage, allPages) => {},
  getPreviousPageParam: (firstPage, allPages) => {},
  //...
};

const infiniteGetReturns = useInfiniteGet<InfiniteGetData, InfiniteGetError>(
  infiniteGetConfig,
  infiniteGetOptions
);

fakePostsPages.fetchNextPage();
// OR manually specify pageParam
fakePostsPages.fetchNextPage({ pageParam: 2 });

// Note: passing getNextPageParam will override default implementation, which is based on increasing pageParam by 1 on every fetchNextPage call till finish all pages, in that case you need to provide your own implementation

/**
 * Example:
 */
const useFakePostsPages = (options) => {
  const [fakePostsPagesConfig] = useQueryConfig(
    'jsonplaceholder',
    'fakePostsPages'
  );
  return useInfiniteGet(
    {
      key: 'FAKE_POSTS_PAGES',
      pageParam: 1,
      pageSize: 10,
      ...fakePostsPagesConfig,
    },
    options
  );
};

const { data, error, fetchNextPage, ...rest } = useFakePostsPages({
  onSuccess: (data) => {
    console.log('fakePostsPagesData: ', data);
  },
});

fetchNextPage();
```

</details>

<br/>

`- infiniteGetOptions:` [useInfiniteQuery] options,
expect `queryKey`(mapped to `key` in `infiniteGetConfig`) and `queryFn`.

`- infiniteGetReturns:` [useInfiniteQuery] returns.

---

### `usePost`

A wrapper around [useMutation] hook.

```javascript
import { useQueryConfig, usePost } from 'react-native-queries';

const postConfig = {
  baseURL: '...',
  url: '...',
  requestConfig: '...',
};

const postOptions = {
  onSuccess: (data) => {},
  onError: (error) => {},
  //...
};

const postReturns = usePost(postConfig, postOptions);

/**
 * Example:
 */
const useCreateFakePost = (options) => {
  const [createPostConfig] = useQueryConfig(
    'jsonplaceholder',
    'createFakePost'
  );
  return usePost(createPostConfig, options);
};

const { data, error, mutate, ...rest } = useCreateFakePost({
  onSuccess: (data) => {
    console.log('createFakePostData: ', data);
  },
});

mutate({ title: 'foo', body: 'bar', userId: 1 });
```

<details>
<summary><b>Typescript</b></summary>

```typescript
import { useQueryConfig, usePost } from 'react-native-queries';
import type { UsePostConfig, UsePostOptions } from 'react-native-queries';

interface PostData {}
interface PostError {}
interface PostVariables {}

const postConfig: UsePostConfig = {
  baseURL: '...',
  url: '...',
  requestConfig: '...',
};

const postOptions: UsePostOptions<PostData, PostError, PostVariables> = {
  onSuccess: (data) => {},
  onError: (error) => {},
  //...
};

const postReturns = usePost<PostData, PostError, PostVariables>(
  postConfig,
  postOptions
);

/**
 * Example:
 */
interface CreateFakePostData {
  body: string;
  id: number;
  title: string;
  userId: number;
}
interface CreateFakePostError {}
interface CreateFakePostVariables {
  title: string;
  body: string;
  userId: number;
}

const useCreateFakePost = (
  options?: UsePostOptions<
    CreateFakePostData,
    CreateFakePostError,
    CreateFakePostVariables
  >
) => {
  const [createFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'createFakePost'
  );
  return usePost<
    CreateFakePostData,
    CreateFakePostError,
    CreateFakePostVariables
  >(createFakePostConfig, options);
};

const { data, error, mutate, ...rest } = useCreateFakePost({
  onSuccess: (data) => {
    console.log('createFakePostData: ', data);
  },
});

mutate({ title: 'foo', body: 'bar', userId: 1 });
```

</details>

<br/>

`- postOptions:` [useMutation] options, expect `mutationFn`.

`- postReturns:` [useMutation] returns.

---

### `usePut`

A wrapper around [useMutation] hook.

```javascript
import { useQueryConfig, usePut, parseConfigURL } from 'react-native-queries';

const putConfig = {
  baseURL: '...',
  url: '...',
  requestConfig: '...',
};

const putOptions = {
  onSuccess: (data) => {},
  onError: (error) => {},
  //...
};

const putReturns = usePut(putConfig, putOptions);

/**
 * Example:
 */
const useUpdateFakePost = (id, options) => {
  const [updateFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'updateFakePost'
  );
  return usePut(parseConfigURL(updateFakePostConfig, { id }), options);
};

const { data, error, mutate, ...rest } = useUpdateFakePost(1, {
  onSuccess: (data) => {
    console.log('updateFakePostData: ', data);
  },
});

mutate({ id: 1, title: 'foo', body: 'bar', userId: 1 });
```

<details>
<summary><b>Typescript</b></summary>

```typescript
import { useQueryConfig, usePut } from 'react-native-queries';
import type { UsePutConfig, UsePutOptions } from 'react-native-queries';

interface PutData {}
interface PutError {}
interface PutVariables {}

const putConfig: UsePutConfig = {
  baseURL: '...',
  url: '...',
  requestConfig: '...',
};

const putOptions: UsePutOptions<PutData, PutError, PutVariables> = {
  onSuccess: (data) => {},
  onError: (error) => {},
  //...
};

const putReturns = usePut<PutData, PutError, PutVariables>(
  putConfig,
  putOptions
);

/**
 * Example:
 */
interface UpdateFakePostData {
  body: string;
  id: number;
  title: string;
  userId: number;
}
interface UpdateFakePostError {}
interface UpdateFakePostVariables {
  title: string;
  body: string;
  userId: number;
  id: number;
}

const useUpdateFakePost = (
  id: number,
  options?: UsePutOptions<
    UpdateFakePostData,
    UpdateFakePostError,
    UpdateFakePostVariables
  >
) => {
  const [updateFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'updateFakePost'
  );
  return usePut<
    UpdateFakePostData,
    UpdateFakePostError,
    UpdateFakePostVariables
  >(parseConfigURL(updateFakePostConfig, { id }), options);
};
```

</details>

<br/>

`- putOptions:` [useMutation] options, expect `mutationFn`.

`- putReturns:` [useMutation] returns.

---

### `usePatch`

A wrapper around [useMutation] hook.

```javascript
import { useQueryConfig, usePatch, parseConfigURL } from 'react-native-queries';

const patchConfig = {
  baseURL: '...',
  url: '...',
  requestConfig: '...',
};

const patchOptions = {
  onSuccess: (data) => {},
  onError: (error) => {},
  //...
};

const patchReturns = usePatch(patchConfig, patchOptions);

/**
 * Example:
 */
const usePatchFakePost = (id, options) => {
  const [updateFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'patchFakePost'
  );
  return usePatch(parseConfigURL(updateFakePostConfig, { id }), options);
};

const { data, error, mutate, ...rest } = usePatchFakePost(1, {
  onSuccess: (data) => {
    console.log('patchFakePostData: ', data);
  },
});

mutate({ title: 'foo' });
```

<details>
<summary><b>Typescript</b></summary>

```typescript
import { useQueryConfig, usePatch } from 'react-native-queries';
import type { UsePatchConfig, UsePatchOptions } from 'react-native-queries';

interface PatchData {}
interface PatchError {}
interface PatchVariables {}

const patchConfig: UsePatchConfig = {
  baseURL: '...',
  url: '...',
  requestConfig: '...',
};

const patchOptions: UsePatchOptions<PatchData, PatchError, PatchVariables> = {
  onSuccess: (data) => {},
  onError: (error) => {},
  //...
};

const patchReturns = usePatch<PatchData, PatchError, PatchVariables>(
  patchConfig,
  patchOptions
);

/**
 * Example:
 */
interface PatchFakePostData {
  body: string;
  id: number;
  title: string;
  userId: number;
}
interface PatchFakePostError {}
interface PatchFakePostVariables {
  title: string;
}

const usePatchFakePost = (
  id: number,
  options?: UsePatchOptions<
    PatchFakePostData,
    PatchFakePostError,
    PatchFakePostVariables
  >
) => {
  const [patchFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'updateFakePost'
  );
  return usePatch<
    PatchFakePostData,
    PatchFakePostError,
    PatchFakePostVariables
  >(parseConfigURL(patchFakePostConfig, { id }), options);
};

const { data, error, mutate, ...rest } = usePatchFakePost(1, {
  onSuccess: (data) => {
    console.log('patchFakePostData: ', data);
  },
});

mutate({ title: 'foo' });
```

</details>

<br/>

`- patchOptions:` [useMutation] options, expect `mutationFn`.

`- patchReturns:` [useMutation] returns.

---

### `useDelete`

A wrapper around [useMutation] hook.

```javascript
import { useQueryConfig, useDelete } from 'react-native-queries';

const deleteConfig = {
  baseURL: '...',
  url: '...',
  requestConfig: '...',
};

const deleteOptions = {
  onSuccess: (data) => {},
  onError: (error) => {},
  //...
};

const deleteReturns = useDelete(deleteConfig, deleteOptions);

/**
 * Example:
 */
//Forme 1: pass id as mutate arg
const useDeleteFakePost = (options) => {
  const [deleteFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'deleteFakePost'
  );
  return useDelete(deleteFakePostConfig, options);
};

const { data, error, mutate, ...rest } = useDeleteFakePost({
  onSuccess: (data) => {
    console.log('deleteFakePostData: ', data);
  },
});

// mutate variables are pathParams here.
// ex: 'posts/{{id}}' will sent as 'posts/1'.
mutate({ id: 1 });

//Forme 2: pass id as hook arg
const useDeleteFakePost = (id, options) => {
  const [deleteFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'deleteFakePost'
  );
  return useDelete(parseConfigURL(deleteFakePostConfig, { id }), options);
};

const { data, error, mutate, ...rest } = useDeleteFakePost(1, {
  onSuccess: (data) => {
    console.log('deleteFakePostData: ', data);
  },
});

mutate();
```

<details>
<summary><b>Typescript</b></summary>

```typescript
import { useQueryConfig, useDelete } from 'react-native-queries';
import type { UseDeleteConfig, UseDeleteOptions } from 'react-native-queries';

interface DeleteData {}
interface DeleteError {}
interface DeleteVariables {}

const deleteConfig: UseDeleteConfig = {
  baseURL: '...',
  url: '...',
  requestConfig: '...',
};

const deleteOptions: UseDeleteOptions<
  DeleteData,
  DeleteError,
  DeleteVariables
> = {
  onSuccess: (data) => {},
  onError: (error) => {},
  //...
};

const deleteReturns = useDelete<DeleteData, DeleteError, DeleteVariables>(
  deleteConfig,
  deleteOptions
);

/**
 * Example:
 */
//Forme 1: pass id as mutate arg
interface DeleteFakePostData {}
interface DeleteFakePostError {}
interface DeleteFakePostVariables {
  id: number;
}

const useDeleteFakePost = (
  options?: UseDeleteOptions<
    DeleteFakePostData,
    DeleteFakePostError,
    DeleteFakePostVariables
  >
) => {
  const [deleteFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'deleteFakePost'
  );
  return useDelete<
    DeleteFakePostData,
    DeleteFakePostError,
    DeleteFakePostVariables
  >(deleteFakePostConfig, options);
};

const { data, error, mutate, ...rest } = useDeleteFakePost({
  onSuccess: (data) => {
    console.log('deleteFakePostData: ', data);
  },
});

// mutate variables are pathParams here.
// ex: posts/{{id}} will sent as posts/1.
mutate({ id: 1 });

//Forme 2: pass id as hook arg
interface DeleteFakePostData {}
interface DeleteFakePostError {}
interface DeleteFakePostVariables {}

const useDeleteFakePost = (
  id: number,
  options?: UseDeleteOptions<
    DeleteFakePostData,
    DeleteFakePostError,
    DeleteFakePostVariables
  >
) => {
  const [deleteFakePostConfig] = useQueryConfig(
    'jsonplaceholder',
    'deleteFakePost'
  );
  return useDelete<
    DeleteFakePostData,
    DeleteFakePostError,
    DeleteFakePostVariables
  >(parseConfigURL(deleteFakePostConfig, { id }), options);
};

const { data, error, mutate, ...rest } = useDeleteFakePost(1, {
  onSuccess: (data) => {
    console.log('deleteFakePostData: ', data);
  },
});

mutate();
```

</details>

<br/>

`- deleteOptions:` [useMutation] options, expect `mutationFn`.

`- deleteReturns:` [useMutation] returns.

---

### `parseConfigURL`

Util to replace placeholder between `{{...}}` in url.

```javascript
const parsedConfigURL = parseConfigURL(
  { baseURL: 'https://jsonplaceholder.typicode.com', url: 'posts/{{id}}' },
  { id: 1 }
);

//Output: { baseURL: 'https://jsonplaceholder.typicode.com', url: 'posts/1', }

/**
 * Example:
 */
const [deleteFakePostConfig] = useQueryConfig(
  'jsonplaceholder',
  'deleteFakePost'
);
const parsedDeleteFakePostConfig = parseConfigURL(deleteFakePostConfig, {
  id: 1,
});
```
