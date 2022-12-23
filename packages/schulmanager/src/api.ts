import axios from 'axios';

import { InvalidResponse, InvalidStatusCode, MissingNewToken, NotAuthenticated } from './errors';
import { StatisticBySubject, StatisticByTime, StatisticsRequest } from './models/statistics';
import {
  Endpoints,
  LoginResponse,
  LoginResponseBody,
  LoginResponseResult,
  LoginStatusResponseBody,
  LoginStatusResponseResult,
  MakeRawRequest,
  Modules,
  RequestBody,
  RequestParamsHelper,
  Response,
  ResponseBody,
  ResponseResults
} from './types';

const BASE_URL = 'https://login.schulmanager-online.de/api';

/**
 * Get Login Status
 * @param token Token
 * @throws {NotAuthenticated}
 */
export async function getLoginStatus(token: string): Promise<Response<LoginStatusResponseResult>> {
  const { data, token: newToken } = await makeRawRequest<LoginStatusResponseBody>({
    endpoint: '/login-status',
    body: undefined,
    options: buildOptions(token),
    responseValidator: (res) => {
      if (res.isAuthenticated !== true) {
        throw new NotAuthenticated(false);
      }
    }
  });
  return {
    newToken,
    data: data.user
  };
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse<LoginResponseResult>> {
  const { data } = await makeLoginRequest<LoginResponseBody>({
    endpoint: '/login',
    body: {
      emailOrUsername: email,
      password: password,
      mobileApp: false,
      institutionId: null
    },
    options: buildOptions(null)
  });
  return {
    token: data.jwt,
    data: data.user
  };
}

export async function getStatistics<T extends 'time' | 'subject'>(
  token: string,
  params: StatisticsRequest<T>
): Promise<Response<T extends 'time' ? StatisticByTime : StatisticBySubject[]>> {
  return makeRequest(token, 'classbook', 'get-statistics', params);
}

/**
 * Makes a call to the Schulmanager API
 * @param token Token
 * @param moduleName Name of the Module
 * @param endpointName Name of the Endpoint / Function
 * @param parameters Additional Parameters
 * @returns Data and new Token
 */
export async function makeRequest<T extends Modules, K extends Endpoints[T]>(
  token: string,
  moduleName: T,
  endpointName: K,
  parameters: RequestParamsHelper<K>
): Promise<Response<ResponseResults[K]>> {
  const { data, token: newToken } = await makeRawRequest<ResponseBody<K>>({
    endpoint: '/calls',
    body: buildBody(moduleName, endpointName, parameters),
    options: buildOptions(token),
    responseValidator: validateResponse
  });
  return {
    newToken,
    data: data.results[0].data
  };
}

/**
 * Wrapper around axios
 * @throws {AxiosError}
 */
export async function makeRawRequest<T>({
  endpoint,
  body,
  options,
  responseValidator
}: MakeRawRequest<T>) {
  const response = await axios.post<T>(`${BASE_URL}${endpoint}`, body, options);
  responseValidator(response.data);
  const token = validateHeader(response.headers);
  return {
    token,
    data: response.data
  };
}

export async function makeLoginRequest<T>({
  endpoint,
  body,
  options
}: Omit<MakeRawRequest<T>, 'responseValidator'>) {
  const response = await axios.post<T>(`${BASE_URL}${endpoint}`, body, options);
  return {
    data: response.data
  };
}

/**
 * Checks if the response is valid
 * @param res Response Body
 * @throws {InvalidResponse}
 * @throws {InvalidStatusCode}
 */
export function validateResponse(res: ResponseBody<Endpoints[Modules]>) {
  if (res.results[0].status !== 200) {
    throw new InvalidStatusCode(res.results[0].status);
  }
  if (res.results[0].data === null) {
    throw new InvalidResponse(null);
  }
}

/**
 * Checks if the header contains a new token
 * @param header Axios Response Header
 * @throws {MissingNewToken}
 * @returns New Token
 */
export function validateHeader(header: Partial<Record<string, string>>) {
  if (header['x-new-bearer-token'] === undefined) {
    throw new MissingNewToken(undefined);
  }
  return header['x-new-bearer-token'];
}

/**
 * Builds the request body
 * @param moduleName Name of the Module
 * @param endpointName Name of the Endpoint / Function
 * @param parameters Additional Parameters
 * @returns The Request Body
 */
export function buildBody<T extends Modules, K extends Endpoints[T]>(
  moduleName: T,
  endpointName: K,
  parameters: RequestParamsHelper<K>
): RequestBody<T> {
  return {
    bundleVersion: 'ba0274f0b4a50ac881ae',
    requests: [
      {
        moduleName: moduleName,
        endpointName: endpointName,
        parameters
      }
    ]
  };
}

export function buildOptions(token: string | null) {
  const options = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Accept-Encoding': 'none',
      'User-Agent': 'kaaax0815/schulmanager 1.0'
    },
    responseType: 'json'
  } as const;
  if (token !== null) {
    const tokenOptions = {
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`
      }
    } as const;
    return tokenOptions;
  }
  return options;
}
