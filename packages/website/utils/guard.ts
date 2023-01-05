import { getSession, Session } from '@auth0/nextjs-auth0';
import { Settings, User } from '@prisma/client';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { countNewMessages, getNewNotificationsCount, InvalidStatusCode } from 'schulmanager';

import { UseIconsProps } from '@/hooks/useIcons';
import prisma from '@/lib/prisma';

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
          destination: `/api/auth/login?returnTo=${ctx.resolvedUrl}`,
          permanent: false
        }
      };
    }
    return func({ ...ctx, session });
  };
}

export interface AuthAndDBProps extends AuthProps {
  user: User & {
    settings: Settings;
  };
  iconsData: UseIconsProps;
}

export type withAuthAndDBFunc<T extends Props> = withAuthFunc<T, AuthAndDBProps>;

export function withAuthAndDB<T extends Props>(func: withAuthAndDBFunc<T>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
    const session = await getSession(ctx.req, ctx.res);
    if (!session?.user) {
      return {
        redirect: {
          destination: `/api/auth/login?returnTo=${ctx.resolvedUrl}`,
          permanent: false
        }
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        sub: session.user.sub
      },
      include: {
        settings: true
      }
    });

    if (!user) {
      return {
        redirect: {
          destination: '/account?error=notfound',
          permanent: false
        }
      };
    }

    const userAndSettings = user as User & {
      settings: Settings;
    };

    if (!user.settings) {
      const settings = await prisma.settings.create({
        data: {
          userId: user.id
        }
      });
      userAndSettings.settings = settings;
    }

    try {
      const unreadMessages = await countNewMessages(user.jwt);
      const newNotifications = await getNewNotificationsCount(user.jwt);

      const iconsData = {
        messageCount: unreadMessages.data,
        notificationCount: newNotifications.data
      };

      return func({ ...ctx, session, user: userAndSettings, iconsData });
    } catch (e) {
      if (e instanceof InvalidStatusCode) {
        return {
          redirect: {
            destination: '/account?error=jwt',
            permanent: false
          }
        };
      }
      throw e;
    }
  };
}
