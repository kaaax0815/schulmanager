import axios from 'axios';

import { retrieveNewToken } from './api';
import { BASE_URL, DEFAULT_HEADERS } from './constants';
import { NotAuthenticated } from './errors';
import { Login, LoginStatus } from './models';

/**
 * Login to Schulmanager
 * @param emailOrUsername Email or Username
 * @param password Password
 */
export async function login(emailOrUsername: string, password: string) {
  const response = await axios<Login>(`${BASE_URL}/login`, {
    method: 'POST',
    data: {
      emailOrUsername,
      password,
      mobileApp: false,
      institutionId: null
    },
    headers: DEFAULT_HEADERS,
    responseType: 'json'
  });

  return {
    token: response.data.jwt,
    data: response.data
  };
}

/**
 * Get Login Status
 * @param token JWT Token
 */
export async function getLoginStatus(token: string) {
  const headers = {
    ...DEFAULT_HEADERS,
    Authorization: `Bearer ${token}`
  };

  const response = await axios<LoginStatus>(`${BASE_URL}/login-status`, {
    method: 'POST',
    headers,
    responseType: 'json'
  });

  if (response.data.isAuthenticated === false) {
    throw new NotAuthenticated(false);
  }

  const newToken = retrieveNewToken(response);

  return {
    newToken,
    data: response.data.user
  };
}
