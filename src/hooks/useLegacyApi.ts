import { useCallback } from 'react';
import type { TServerCall } from '@/types/authContext';
import { useAuth } from './useAuth';

export const useLegacyApi = () => {
  const { callApi, callFileApi } = useAuth();

  const request = useCallback(
    (config: TServerCall) => {
      return callApi(config);
    },
    [callApi]
  );

  const requestFile = useCallback(
    (config: TServerCall) => {
      return callFileApi(config);
    },
    [callFileApi]
  );

  const get = useCallback(
    (url: string | number | Array<string | number>) => {
      return callApi({ entity: url, method: 'get' });
    },
    [callApi]
  );

  const post = useCallback(
    (url: string | number | Array<string | number>, data?: unknown) => {
      return callApi({ entity: url, method: 'post', data });
    },
    [callApi]
  );

  const put = useCallback(
    (url: string | number | Array<string | number>, data?: unknown) => {
      return callApi({ entity: url, method: 'put', data });
    },
    [callApi]
  );

  const deleteRequest = useCallback(
    (url: string | number | Array<string | number>) => {
      return callApi({ entity: url, method: 'delete' });
    },
    [callApi]
  );

  const patch = useCallback(
    (url: string | number | Array<string | number>, data?: unknown) => {
      return callApi({ entity: url, method: 'patch', data });
    },
    [callApi]
  );

  return {
    request,
    requestFile,
    get,
    post,
    put,
    delete: deleteRequest,
    patch,
  };
};
