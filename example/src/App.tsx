import React, { useEffect } from 'react';
import {
  QueriesProvider,
  useQueryConfig,
  useGet,
  usePost,
  usePut,
  usePatch,
  useDelete,
  parseConfigURL,
  useQueryClient,
} from 'react-native-queries';
import type {
  UseGetOptions,
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
