import { useRouter } from 'next/router';

export default function useRouterRefresh() {
  const router = useRouter();
  return (stripQuery = false) => {
    router.replace(stripQuery ? router.pathname : router.asPath);
  };
}
