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
      sub: body.data.sub
    }
  });
  if (userExists !== null) {
    res.status(409).send({ status: 'error', message: 'Entry for that user already exists' });
    return;
  }
  const createdUser = await prisma.user.create({
    data: {
      jwt: body.data.jwt,
      sub: body.data.sub
    }
  });
  return res.status(200).send({ status: 'success', data: { id: createdUser.id } });
}
