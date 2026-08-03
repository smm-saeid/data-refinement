// src/hooks/useKeycloakApi.ts
import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosError, type AxiosRequestConfig } from 'axios';
import {
  axiosKeycloakClient,
  type NormalizedApiResponse,
} from '../lib/axios-keycloak';

// Generic API Error type that preserves full Axios error
export type ApiError<T = any> = AxiosError<T>;

export interface UseKeycloakApiQueryOptions<
  TData = unknown,
  TParams = unknown,
  TError = any,
  TSelectedData = TData,
> extends Omit<
    UseQueryOptions<
      NormalizedApiResponse<TData>,
      ApiError<TError>,
      TSelectedData
    >,
    'queryKey' | 'queryFn'
  > {
  url: string;
  params?: TParams;
  config?: AxiosRequestConfig;
  queryKey?: any[];
}

export interface UseKeycloakApiMutationOptions<
  TData = unknown,
  TVariables = unknown,
  TError = any,
> extends Omit<
    UseMutationOptions<TData, ApiError<TError>, TVariables>,
    'mutationFn'
  > {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  config?: AxiosRequestConfig;
}

/**
 * Custom hook for Keycloak API GET requests using React Query
 * Uses URL as query key automatically
 */
export function useKeycloakApiQuery<
  TData = unknown,
  TParams = unknown,
  TError = any,
  TSelectedData = NormalizedApiResponse<TData>,
>(options: UseKeycloakApiQueryOptions<TData, TParams, TError, TSelectedData>) {
  const { url, params, config, queryKey, ...queryOptions } = options;

  const finalQueryKey = queryKey || [url, params, config];

  return useQuery<
    NormalizedApiResponse<TData>,
    ApiError<TError>,
    TSelectedData
  >({
    queryKey: finalQueryKey,
    queryFn: async () => {
      // Use POST method with request body in data property
      const response = await axiosKeycloakClient.post<TData>(
        url,
        config?.data, // Request body
        {
          ...config,
          params, // URL parameters
        }
      );

      // ✅ Return complete normalized response
      return {
        data: response.data,
        message: response.message,
        status: response.status,
        meta: response.meta,
      };
    },
    ...queryOptions,
  });
}

/**
 * Custom hook for Keycloak API mutations (POST, PUT, PATCH, DELETE)
 */
export function useKeycloakApiMutation<
  TData = unknown,
  TVariables = unknown,
  TError = any,
>(options: UseKeycloakApiMutationOptions<TData, TVariables, TError>) {
  const { url, method = 'POST', config, ...mutationOptions } = options;

  return useMutation<TData, ApiError<TError>, TVariables>({
    mutationFn: async (variables: TVariables) => {
      let response;

      switch (method) {
        case 'POST':
          response = await axiosKeycloakClient.post<TData>(
            url,
            variables,
            config
          );
          break;
        case 'PUT':
          response = await axiosKeycloakClient.put<TData>(
            url,
            variables,
            config
          );
          break;
        case 'PATCH':
          response = await axiosKeycloakClient.patch<TData>(
            url,
            variables,
            config
          );
          break;
        case 'DELETE':
          response = await axiosKeycloakClient.delete<TData>(url, {
            ...config,
            data: variables,
          });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return response.data;
    },
    ...mutationOptions,
  });
}

/**
 * Convenience hook for POST requests to Keycloak API
 */
export function useKeycloakApiPost<
  TData = unknown,
  TVariables = unknown,
  TError = any,
>(
  url: string,
  options?: Omit<
    UseKeycloakApiMutationOptions<TData, TVariables, TError>,
    'url' | 'method'
  >
) {
  return useKeycloakApiMutation<TData, TVariables, TError>({
    url,
    method: 'POST',
    ...options,
  });
}

/**
 * Convenience hook for PUT requests to Keycloak API
 */
export function useKeycloakApiPut<
  TData = unknown,
  TVariables = unknown,
  TError = any,
>(
  url: string,
  options?: Omit<
    UseKeycloakApiMutationOptions<TData, TVariables, TError>,
    'url' | 'method'
  >
) {
  return useKeycloakApiMutation<TData, TVariables, TError>({
    url,
    method: 'PUT',
    ...options,
  });
}

/**
 * Convenience hook for PATCH requests to Keycloak API
 */
export function useKeycloakApiPatch<
  TData = unknown,
  TVariables = unknown,
  TError = any,
>(
  url: string,
  options?: Omit<
    UseKeycloakApiMutationOptions<TData, TVariables, TError>,
    'url' | 'method'
  >
) {
  return useKeycloakApiMutation<TData, TVariables, TError>({
    url,
    method: 'PATCH',
    ...options,
  });
}

/**
 * Convenience hook for DELETE requests to Keycloak API
 */
export function useKeycloakApiDelete<
  TData = unknown,
  TVariables = unknown,
  TError = any,
>(
  url: string,
  options?: Omit<
    UseKeycloakApiMutationOptions<TData, TVariables, TError>,
    'url' | 'method'
  >
) {
  return useKeycloakApiMutation<TData, TVariables, TError>({
    url,
    method: 'POST',
    ...options,
  });
}
