// src/lib/axios-Keycloak-client.ts
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

// Reuse the same normalized response interface
export interface NormalizedApiResponse<T = any> {
  responseList: any;
  status: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: {
      totalPages?: number;
      count: number;
      pageSize: number;
      currentPage: number;
    };
  };
}

export const axiosKeycloakClient = axios.create({
  baseURL: import.meta.env.VITE_KEYCLOAK_SERVICE || 'http://localhost:8081', // Different default port
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - identical to original
axiosKeycloakClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Helper function to detect and normalize response format - identical to original
function normalizeResponse<T>(responseData: any): NormalizedApiResponse<T> {
  // Check if it's Format 2 (has rows property)
  if (
    responseData?.data &&
    typeof responseData.data === 'object' &&
    'rows' in responseData.data &&
    'count' in responseData.data
  ) {
    // Format 2: { data: { rows, count, currentPage, pageSize } }
    return {
      status: responseData.status,
      message: responseData.message,
      data: responseData.data.rows,
      meta: {
        pagination: {
          count: responseData.data.count,
          currentPage: responseData.data.currentPage,
          pageSize: responseData.data.pageSize,
          totalPages:
            responseData.data.totalPages ||
            Math.ceil(responseData.data.count / responseData.data.pageSize),
        },
      },
    };
  }

  // Check if it's Format 1 (has meta property)
  if (responseData?.data && responseData?.meta) {
    // Format 1: { data: [...], meta: { pagination } }
    return {
      status: responseData.status,
      message: responseData.message,
      data: responseData.data,
      meta: responseData.meta,
    };
  }

  // If data is directly an array or object (simple format)
  if (responseData?.data) {
    return {
      status: responseData.status,
      message: responseData.message,
      data: responseData.data,
    };
  }

  // Fallback: return as-is
  return {
    status: responseData.status,
    message: responseData.message,
    data: responseData,
  };
}

// Response interceptor - identical to original
axiosKeycloakClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // ✅ Normalize the response
    const normalized = normalizeResponse(response.data);

    return {
      ...response,
      message: normalized.message,
      data: normalized.data,
      meta: normalized.meta,
    };
  },
  (error: AxiosError) => {
    // Handle errors
    if (error.response?.data) {
      const errorData = error.response.data as any;
      if (errorData?.message) {
        console.error('Keycloak API Error:', errorData.message);
      }
    }
    return Promise.reject(error);
  }
);
