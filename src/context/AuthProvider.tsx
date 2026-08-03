import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSnackbar } from '@/hooks/useSnackbar';
import useLocalStorage from '@/hooks/useLocalStorage';
import { api, apifile, registerAuthToken } from '@/lib/legacyAxios';
import { convertArabicCharToPersian } from '@/lib/convertArabicCharToPersian';
import type { TAuthContext, TServerCall } from '@/types/authContext';
import type { ILoggedInUser } from '@/types/user';

type AxiosRequestInput = {
  client: AxiosInstance;
  call: TServerCall;
  emptyResponse?: unknown;
};

type RefreshPayload = {
  token?: string;
  refreshToken?: string;
};

const defaultUser: ILoggedInUser = { full_name: '', user_id: 0 };
const REFRESH_ENDPOINT = 'user/refresh_token';

export const AuthContext = createContext<TAuthContext | null>(null);

const normalizeEntity = (entity: TServerCall['entity']) => {
  if (Array.isArray(entity)) {
    return convertArabicCharToPersian(entity.join('/')) as string;
  }

  return convertArabicCharToPersian(String(entity)) as string;
};

const serializeData = (data: TServerCall['data']) => {
  if (data === undefined || data === null) {
    return undefined;
  }

  if (data instanceof FormData) {
    return data;
  }

  if (typeof data === 'string') {
    return convertArabicCharToPersian(data);
  }

  return convertArabicCharToPersian(JSON.stringify(data));
};

const buildAxiosConfig = ({
  call,
  token,
}: {
  call: TServerCall;
  token: string | null;
}): AxiosRequestConfig => {
  const normalizedEntity = normalizeEntity(call.entity);
  const serializedData = serializeData(call.data);
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return {
    url: normalizedEntity,
    method: call.method,
    data: serializedData,
    headers,
  };
};

const mapStatusToMessage = (status?: number) => {
  switch (status) {
    case 200:
      return null;
    case 204:
      return 'No data returned from server';
    case 400:
      return 'Invalid request payload';
    case 401:
      return 'Unauthorized request';
    case 403:
      return 'Session expired';
    case 404:
      return 'Resource not found';
    case 409:
      return 'Duplicate data detected';
    case 500:
      return 'Server error';
    default:
      return 'Unexpected server response';
  }
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const snackbar = useSnackbar();
  const [token, setToken] = useLocalStorage<string>('token', '');

  const [userInfo, setUserInfo] = useLocalStorage<ILoggedInUser>(
    'userInfo',
    defaultUser
  );
  const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const tokenRef = useRef(token);

  useEffect(() => {
    tokenRef.current = token;
    registerAuthToken({ token });
  }, [token]);

  function reloadToken() {
    const newToken = localStorage.getItem('token');
    tokenRef.current = newToken;
  }

  const notify = useCallback(
    (status?: number, fallbackMessage?: string) => {
      const resolvedMessage = fallbackMessage ?? mapStatusToMessage(status);
      if (resolvedMessage) {
        snackbar(
          resolvedMessage,
          status && status >= 400 ? 'error' : 'info',
          5000
        );
      }
    },
    [snackbar]
  );

  const clearUserInfo = useCallback(() => {
    setToken('');
    tokenRef.current = '';
    registerAuthToken({ token: null });
    setUserInfo(defaultUser);
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }, [setToken, setUserInfo]);

  const refreshToken = useCallback(async (): Promise<RefreshPayload | null> => {
    if (isRefreshingToken) {
      return null;
    }
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      clearUserInfo();
      return null;
    }

    setIsRefreshingToken(true);
    try {
      const response = await axios.get(
        new URL(REFRESH_ENDPOINT, api.defaults.baseURL).toString(),
        {
          headers: {
            Authorization: `Bearer ${storedRefreshToken}`,
          },
        }
      );
      return response.data?.result ?? null;
    } catch {
      clearUserInfo();
      return null;
    } finally {
      setIsRefreshingToken(false);
    }
  }, [clearUserInfo, isRefreshingToken]);

  const storeToken = useCallback(
    (value: string | { token: string }) => {
      const resolvedToken = typeof value === 'string' ? value : value.token;
      tokenRef.current = resolvedToken;
      setToken(resolvedToken);
      registerAuthToken({ token: resolvedToken });
    },
    [setToken]
  );

  const storeRefreshToken = useCallback(
    (value: string | { refreshToken: string }) => {
      const resolvedRefreshToken =
        typeof value === 'string' ? value : value.refreshToken;
      localStorage.setItem('refreshToken', resolvedRefreshToken);
    },
    []
  );

  const handleAxiosError = useCallback(
    (error: AxiosError) => {
      const status = error.response?.status;
      const message = (error.response?.data as { message?: string })?.message;

      if (status === 401) {
        clearUserInfo();
      }

      if (status === 500) {
        notify(status, 'خطایی در سرور رخ داده!');
        return;
      }

      if (status === 409) {
        notify(status, 'داده تکراری');
        return;
      }

      if (status === 406) {
        notify(status, 'فرمت وارد شده قابل قبول نیست.');
        return;
      }

      notify(status, message);
    },
    [clearUserInfo, notify]
  );

  const sendRequest = useCallback(
    async ({ client, call, emptyResponse }: AxiosRequestInput) => {
      let attemptedRefresh = false;

      const executeRequest = async () => {
        const config = buildAxiosConfig({ call, token: tokenRef.current });
        const response = await client.request(config);
        if (response.status === 204) {
          return emptyResponse ?? {};
        }
        return response.data ?? response;
      };

      try {
        return await executeRequest();
      } catch (caughtError) {
        const axiosError = caughtError as AxiosError;
        const status = axiosError.response?.status;

        if (status === 401 && !attemptedRefresh) {
          attemptedRefresh = true;
          const refreshed = await refreshToken();
          if (refreshed?.token) {
            storeToken(refreshed.token);
            if (refreshed.refreshToken) {
              storeRefreshToken(refreshed.refreshToken);
            }
            return executeRequest();
          }
        }

        handleAxiosError(axiosError);
        throw axiosError;
      }
    },
    [handleAxiosError, refreshToken, storeRefreshToken, storeToken]
  );

  const callApi = useCallback(
    (call: TServerCall) =>
      sendRequest({
        client: api,
        call,
        emptyResponse: { data: { rows: [] } },
      }),
    [sendRequest]
  );

  const callFileApi = useCallback(
    async (call: TServerCall) => {
      const url = normalizeEntity(call.entity);
      const authHeader = tokenRef.current
        ? { Authorization: `Bearer ${tokenRef.current}` }
        : undefined;
      try {
        const response = await apifile({
          url,
          method: call.method.toUpperCase(),
          headers: authHeader,
          body: call.data instanceof FormData ? call.data : undefined,
        });

        if (response.status === 204) {
          return { data: { rows: [] } };
        }

        const payload = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            clearUserInfo();
          }
          notify(response.status, payload?.message);
          throw new Error(payload?.message ?? 'Upload failed');
        }

        return payload?.data ?? payload;
      } catch (error) {
        notify(undefined, (error as Error).message);
        throw error;
      }
    },
    [clearUserInfo, notify]
  );

  const logout = useCallback(() => {
    clearUserInfo();
  }, [clearUserInfo]);

  const contextValue = useMemo(
    () => ({
      token,
      storeToken,
      storeRefreshToken,
      callApi,
      callFileApi,
      isUserLoggedIn: Boolean(token),
      logout,
      userInfo,
      setUserInfo,
      reloadToken,
    }),
    [
      logout,
      callApi,
      callFileApi,
      setUserInfo,
      storeRefreshToken,
      storeToken,
      token,
      userInfo,
      reloadToken,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
