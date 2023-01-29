import { AxiosResponse } from 'axios';

import { InvalidResponse, InvalidStatusCode, MissingNewToken } from './errors';
import { APIResult } from './types';

export function retrieveNewToken(response: AxiosResponse): string {
  const newToken = response.headers['x-new-bearer-token'];

  if (!newToken) {
    throw new MissingNewToken(newToken);
  }

  return newToken;
}

export function validateResult(result: APIResult<unknown>) {
  if (result.status !== 200) {
    throw new InvalidStatusCode(result.status);
  } else if (result.data === null) {
    throw new InvalidResponse(result.data);
  }
}
