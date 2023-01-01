import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiHandler } from 'next';
import { getLoginStatus } from 'schulmanager';

import prisma from '../../../lib/prisma';
import { CreateResponse, CreateSchema } from '../../../schema/create';

export default withApiAuthRequired(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ status: 'error', message: 'Method not allowed' });
  }

  const body = await CreateSchema.safeParseAsync(req.body);
  if (body.success === false) {
    return res.status(400).send({ status: 'error', message: JSON.parse(body.error.message) });
  }

  const session = await getSession(req, res);
  if (session?.user.sub !== body.data.sub) {
    return res.status(403).send({ status: 'error', message: 'Forbidden' });
  }

  const userExists = await prisma.user.findUnique({
    where: {
      sub: body.data.sub
    }
  });
  if (userExists !== null) {
    return res.status(409).send({ status: 'error', message: 'Entry for that user already exists' });
  }

  const loginStatus = await getLoginStatus(body.data.jwt)
    .then(() => true)
    .catch(() => false);
  if (loginStatus === false) {
    return res.status(400).send({ status: 'error', message: 'Invalid JWT' });
  }

  const createdUser = await prisma.user.create({
    data: {
      jwt: body.data.jwt,
      sub: body.data.sub
    }
  });
  return res.status(200).send({ status: 'success', data: { id: createdUser.id } });
} as NextApiHandler<CreateResponse>);
