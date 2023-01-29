import axios from 'axios';

import { retrieveNewToken, validateResult } from './api';
import { BASE_URL, BUNDLE_VERSION, DEFAULT_HEADERS } from './constants';
import { APIResponse, IBatchRequest, ResponseList, Results } from './types';

/**
 * @internal
 */
export function getResults(id: keyof Results): {
  moduleName: string;
  endpointName: string;
} {
  const [moduleName, _endpointName] = id.split(':');
  const [endpointName] = _endpointName.split('+');
  return {
    moduleName,
    endpointName
  };
}

// TODO: mark T as const with TS 5.0
/**
 * Make a Batch Request
 * @param token JWT Token
 * @param requests Array of Requests. See `@important` for more information.
 * @important DO NOT USE `requests` PARAMETER DIRECTLY. Use `get` Function instead. MARK `requests` PARAMETER AS CONST.
 * @example
 * ```ts
 * const { newToken, results } = await batchRequest('token', [
 *   get('letters:get-letters'),
 *   get('null:get-current-term'),
 *   get('schedules:get-actual-lessons', {
 *     start: '2020-01-01',
 *     end: '2020-12-31',
 *     student: { id: 123 }
 *   })
 * ] as const);
 * ```
 */
export async function batchRequest<Requests extends readonly IBatchRequest[]>(
  token: string,
  requests: Requests
): Promise<{ newToken: string; results: ResponseList<Requests> }> {
  const results = [] as Results[keyof Results]['response'][];

  const body = {
    bundleVersion: BUNDLE_VERSION,
    requests: requests.map((p) => ({
      moduleName: p.moduleName,
      endpointName: p.endpointName,
      parameters: p.parameters
    }))
  };

  const headers = {
    ...DEFAULT_HEADERS,
    Authorization: `Bearer ${token}`
  };

  const response = await axios<APIResponse<ResponseList<Requests>>>(`${BASE_URL}/calls`, {
    method: 'POST',
    data: body,
    headers,
    responseType: 'json'
  });

  const newToken = retrieveNewToken(response);

  for (const result of response.data.results) {
    validateResult(result);
    results.push(result.data);
  }

  return {
    newToken,
    results: results as ResponseList<Requests>
  };
}

/**
 * @param id Id of Request
 * @param params Parameters for Request
 * @important DO NOT USE THIS FUNCTION DIRECTLY. USE ONLY WITH `batchRequest` FUNCTION.
 */
export function get<Id extends keyof Results>(
  id: Id,
  ...[params]: Results[Id]['parameters'] extends undefined ? [] : [Results[Id]['parameters']]
): IBatchRequest<Id> {
  const moduleName = getResults(id).moduleName;
  const endpointName = getResults(id).endpointName;
  return {
    id: id,
    moduleName: moduleName,
    endpointName: endpointName,
    parameters: params
  } as IBatchRequest<Id>;
}
