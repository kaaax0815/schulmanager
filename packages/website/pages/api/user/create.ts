import argon2 from 'argon2';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../lib/prisma';
import { CreateResponse, createSchema } from '../../../schema/create';

export default async function handler(req: NextApiRequest, res: NextApiResponse<CreateResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).send({ status: 'error', message: 'Method not allowed' });
  }
  const body = await createSchema.safeParseAsync(req.body);
  if (body.success === false) {
    return res.status(400).send({ status: 'error', message: JSON.parse(body.error.message) });
  }
  const userExists = await prisma.user.findUnique({
    where: {
      name: body.data.name
    }
  });
  if (userExists !== null) {
    res.status(409).send({ status: 'error', message: 'User already exists' });
    return;
  }
  // TODO: validate jwt and password (length, complexity, etc.)
  const hash = await argon2.hash(body.data.password);
  const createdUser = await prisma.user.create({
    data: {
      jwt: body.data.jwt,
      name: body.data.name,
      hash: hash
    }
  });
  return res.status(200).send({ status: 'success', data: { id: createdUser.id } });
}
