import type { ILoggedInUser } from './user';

export type THttpMethods = 'get' | 'post' | 'delete' | 'put' | 'patch';

export type TServerCall = {
  entity: string | number | Array<string | number>;
  data?: unknown;
  method: THttpMethods;
};

export type TAuthContext = {
  token: string;
  storeToken: (token: string | { token: string }) => void;
  storeRefreshToken: (refreshToken: string | { refreshToken: string }) => void;
  callApi: (params: TServerCall) => Promise<any>;
  callFileApi: (params: TServerCall) => Promise<any>;
  isUserLoggedIn: boolean;
  logout: () => void;
  userInfo: ILoggedInUser;
  setUserInfo: (user: ILoggedInUser) => void;
  reloadToken: () => void;
};

