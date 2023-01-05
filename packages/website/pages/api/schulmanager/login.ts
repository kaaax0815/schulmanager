import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiHandler } from 'next';
import { login } from 'schulmanager';

import { LoginResponse, LoginSchema } from '@/schema/login';

export default withApiAuthRequired(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ status: 'error', message: 'Method not allowed' });
  }
  const body = await LoginSchema.safeParseAsync(req.body);
  if (body.success === false) {
    return res.status(400).send({ status: 'error', message: JSON.parse(body.error.message) });
  }
  try {
    const loginStatus = await login(body.data.email, body.data.password);
    return res.status(200).send({ status: 'success', data: { token: loginStatus.token } });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Request failed with status code 401') {
        return res.status(400).send({ status: 'error', message: 'Invalid Email or Password' });
      }
      return res.status(500).send({ status: 'error', message: error.message });
    }
    return res.status(500).send({ status: 'error', message: 'Unknown error' });
  }
} as NextApiHandler<LoginResponse>);
