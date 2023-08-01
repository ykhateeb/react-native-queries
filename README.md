# react-native-queries

[![npm](https://img.shields.io/npm/v/react-native-queries?link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Freact-native-queries)](https://www.npmjs.com/package/react-native-queries)
[![npm](https://img.shields.io/npm/dw/react-native-queries)](https://www.npmjs.com/package/react-native-queries)
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

## Quick Start

#### Wrap & Config

```javascript
//App.js

import React from 'react';
import { QueriesProvider } from 'react-native-queries';

const App = () => {
  return (
    <QueriesProvider
      config={{
        server1: {
          baseURL: 'http://localhost:3000',
          requestConfig: {
            headers: {
              Authorization: 'Bearer 12345',
            },
          },
          user: 'api/user',
          updateUser: 'api/update-user',
        },
      }}
    >
      <MyComponent />
    </QueriesProvider>
  );
};
```

#### Use

```javascript
//MyComponent.js

import React, { useEffect } from 'react';
import {
  useQueryClient,
  useQueryConfig,
  useGet,
  usePost,
} from 'react-native-queries';

const MyComponent = () => {
  const queryClient = useQueryClient();

  //Get
  const [userConfig] = useQueryConfig('server1', 'user');
  const user = useGet({ ...userConfig, key: 'USER' });

  console.log(user.data);

  //Post
  const [updateUserConfig] = useQueryConfig('server1', 'updateUser');
  const { mutate } = usePost(updateUserConfig, {
    onSuccess: () => {
      queryClient.invalidateQueries('USER');
    },
  });

  useEffect(() => {
    mutate({ name: 'updated name' });
  }, [mutate]);

  return null;
};
```
