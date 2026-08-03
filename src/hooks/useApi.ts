// src/hooks/useApi.ts
import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
  keepPreviousData,
} from '@tanstack/react-query';
import { AxiosError, type AxiosRequestConfig } from 'axios';
import { axiosClient, type NormalizedApiResponse } from '@/lib/axios-client';

// Generic API Error type that preserves full Axios error
export type ApiError<T = any> = AxiosError<T>;

export interface UseApiQueryOptions<
  TData = unknown,
  TParams = unknown,
  TError = any,
  TSelectedData = TData
> extends Omit<
  UseQueryOptions<NormalizedApiResponse<TData>, ApiError<TError>, TSelectedData>,
  'queryKey' | 'queryFn'
> {
  url: string;
  params?: TParams;
  config?: Omit<AxiosRequestConfig, 'params'>;
  queryKey?: any[];
}

export interface UseApiMutationOptions<TData = unknown, TVariables = unknown, TError = any>
  extends Omit<UseMutationOptions<TData, ApiError<TError>, TVariables>, 'mutationFn'> {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  config?: AxiosRequestConfig;
}

/**
 * Custom hook for API GET requests using React Query
 * Uses URL as query key automatically
 */
export function useApiQuery<
  TData = unknown,
  TParams = unknown,
  TError = any,
  TSelectedData = NormalizedApiResponse<TData> // ✅ Default to full response
>(options: UseApiQueryOptions<TData, TParams, TError, TSelectedData>) {
  const { url, params, config, queryKey, ...queryOptions } = options;

  const finalQueryKey = queryKey || [url, params];

  return useQuery<NormalizedApiResponse<TData>, ApiError<TError>, TSelectedData>({
    queryKey: finalQueryKey,
    // @ts-ignore
    queryFn: async () => {
      const response = await axiosClient.get<TData>(url, {
        ...config,
        params,
      });
      // ✅ Return complete normalized response
      return {
        data: response.data,
        // @ts-ignore
        message: response.message,
        status: response.status,
        // @ts-ignore
        meta: response.meta,
      };
    },
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
}


/**
 * Custom hook for API mutations (POST, PUT, PATCH, DELETE)
 */
export function useApiMutation<TData = unknown, TVariables = unknown, TError = any>(
  options: UseApiMutationOptions<TData, TVariables, TError>
) {
  const { url, method = 'POST', config, ...mutationOptions } = options;

  return useMutation<TData, ApiError<TError>, TVariables>({
    mutationFn: async (variables: TVariables) => {
      let response;

      switch (method) {
        case 'POST':
          response = await axiosClient.post<TData>(url, variables, config);
          break;
        case 'PUT':
          response = await axiosClient.put<TData>(url, variables, config);
          break;
        case 'PATCH':
          response = await axiosClient.patch<TData>(url, variables, config);
          break;
        case 'DELETE':
          response = await axiosClient.delete<TData>(url, { ...config, data: variables });
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
 * Convenience hook for POST requests
 */
export function useApiPost<TData = unknown, TVariables = unknown, TError = any>(
  url: string,
  options?: Omit<UseApiMutationOptions<TData, TVariables, TError>, 'url' | 'method'>
) {
  return useApiMutation<TData, TVariables, TError>({ url, method: 'POST', ...options });
}

/**
 * Convenience hook for PUT requests
 */
export function useApiPut<TData = unknown, TVariables = unknown, TError = any>(
  url: string,
  options?: Omit<UseApiMutationOptions<TData, TVariables, TError>, 'url' | 'method'>
) {
  return useApiMutation<TData, TVariables, TError>({ url, method: 'PUT', ...options });
}

/**
 * Convenience hook for PATCH requests
 */
export function useApiPatch<TData = unknown, TVariables = unknown, TError = any>(
  url: string,
  options?: Omit<UseApiMutationOptions<TData, TVariables, TError>, 'url' | 'method'>
) {
  return useApiMutation<TData, TVariables, TError>({ url, method: 'PATCH', ...options });
}

/**
 * Convenience hook for DELETE requests
 */
export function useApiDelete<TData = unknown, TVariables = unknown, TError = any>(
  url: string,
  options?: Omit<UseApiMutationOptions<TData, TVariables, TError>, 'url' | 'method'>
) {
  return useApiMutation<TData, TVariables, TError>({ url, method: 'DELETE', ...options });
}