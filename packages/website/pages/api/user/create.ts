import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiHandler } from 'next';

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
  const userExists = await prisma.user.findUnique({
    where: {
      sub: body.data.sub
    }
  });
  if (userExists !== null) {
    return res.status(409).send({ status: 'error', message: 'Entry for that user already exists' });
  }
  const createdUser = await prisma.user.create({
    data: {
      jwt: body.data.jwt,
      sub: body.data.sub
    }
  });
  return res.status(200).send({ status: 'success', data: { id: createdUser.id } });
} as NextApiHandler<CreateResponse>);
