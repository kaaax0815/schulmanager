/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var workbox: Workbox;
}
