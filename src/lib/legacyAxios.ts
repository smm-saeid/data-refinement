import axios, { type AxiosInstance } from 'axios';

type CreateClientInput = {
  baseURL?: string;
  withJsonHeader?: boolean;
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/';

const createClient = ({ baseURL, withJsonHeader = true }: CreateClientInput) =>
  axios.create({
    baseURL,
    headers: withJsonHeader ? { 'Content-Type': 'application/json' } : undefined,
  });

export const api = createClient({ baseURL: API_BASE_URL });

export type FileRequestInput = {
  url: string;
  method: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
};

export const apifile = ({ url, method, headers, body }: FileRequestInput) => {
  return fetch(new URL(url, API_BASE_URL).toString(), {
    method,
    headers,
    body,
  });
};

type RegisterAuthTokenInput = {
  token?: string | null;
};

const authAwareClients: AxiosInstance[] = [api];

export const registerAuthToken = ({ token }: RegisterAuthTokenInput) => {
  authAwareClients.forEach(client => {
    if (token) {
      client.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete client.defaults.headers.common.Authorization;
    }
  });
};

