import { environments } from '@/settings/environments/environments';
import type { HttpClientInterface } from '../interfaces/HttpClientInterface';
import { AxiosHttpClient } from '../http/axios/AxiosClient';
import { FetchHttpClient } from '../http/fetch/FetchClient';

const clientType: string = environments.HTTP_CLIENT || 'axios';

const httpClient: HttpClientInterface =
  clientType === 'axios' ? new AxiosHttpClient() : new FetchHttpClient();

export const apiClient: HttpClientInterface = {
  request: (url, options) => httpClient.request(url, options),
  get: (url, options) => httpClient.get(url, options),
  post: (url, body, options) => httpClient.post(url, body, options),
  put: (url, body, options) => httpClient.put(url, body, options),
  delete: (url, options) => httpClient.delete(url, options),
  patch: (url, body, options) => httpClient.patch(url, body, options),
  setUnauthorizedHandler: (handler) => {
    if ('setUnauthorizedHandler' in httpClient) {
      httpClient.setUnauthorizedHandler(handler);
    }
  }
};
