import { getSession, Session } from '@auth0/nextjs-auth0';
import { User } from '@prisma/client';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import prisma from '../lib/prisma';

export type Props = { [key: string]: unknown } | Promise<{ [key: string]: unknown }>;

export interface AuthProps extends GetServerSidePropsContext {
  session: Session;
}

export type withAuthFunc<T extends Props, K = AuthProps> = (
  arg0: K
) => GetServerSidePropsResult<T> | Promise<GetServerSidePropsResult<T>>;

export function withAuth<T extends Props>(func: withAuthFunc<T>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
    const session = await getSession(ctx.req, ctx.res);
    if (!session?.user) {
      return {
        redirect: {
          destination: '/api/auth/login',
          permanent: false
        }
      };
    }
    return func({ ...ctx, session });
  };
}

export interface AuthAndDBProps extends AuthProps {
  entry: User;
}

export type withAuthAndDBFunc<T extends Props> = withAuthFunc<T, AuthAndDBProps>;

export function withAuthAndDB<T extends Props>(func: withAuthAndDBFunc<T>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
    const session = await getSession(ctx.req, ctx.res);
    if (!session?.user) {
      return {
        redirect: {
          destination: '/api/auth/login',
          permanent: false
        }
      };
    }

    const entry = await prisma.user.findUnique({
      where: {
        sub: session.user.sub
      }
    });

    if (!entry) {
      return {
        redirect: {
          destination: '/account?error=notfound',
          permanent: false
        }
      };
    }
    return func({ ...ctx, session, entry });
  };
}
