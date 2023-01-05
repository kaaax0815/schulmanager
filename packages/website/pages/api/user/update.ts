import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiHandler } from 'next';
import { getLoginStatus } from 'schulmanager';

import prisma from '@/lib/prisma';
import { UpdateResponse, UpdateSchema } from '@/schema/update';

export default withApiAuthRequired(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ status: 'error', message: 'Method not allowed' });
  }

  const body = await UpdateSchema.safeParseAsync(req.body);
  if (body.success === false) {
    return res.status(400).send({ status: 'error', message: JSON.parse(body.error.message) });
  }

  const session = await getSession(req, res);
  if (session?.user.sub !== body.data.sub) {
    return res.status(403).send({ status: 'error', message: 'Forbidden' });
  }

  const user = await prisma.user.findUnique({
    where: {
      sub: body.data.sub
    }
  });
  if (user === null) {
    return res.status(404).send({ status: 'error', message: 'User not found' });
  }

  const toUpdate: Omit<UpdateSchema, 'sub'> = {};

  if (body.data.jwt) {
    const loginStatus = await getLoginStatus(body.data.jwt)
      .then(() => true)
      .catch(() => false);

    if (loginStatus === false) {
      return res
        .status(401)
        .send({ status: 'error', message: 'Invalid JWT', nachricht: 'Ungültiger Token' });
    }

    toUpdate.jwt = body.data.jwt;
  }

  if (body.data.settings !== undefined) {
    toUpdate.settings = body.data.settings;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      ...toUpdate,
      settings: {
        update: {
          ...toUpdate.settings
        }
      }
    }
  });
  return res.status(200).send({ status: 'success', data: { id: updatedUser.id } });
} as NextApiHandler<UpdateResponse>);
