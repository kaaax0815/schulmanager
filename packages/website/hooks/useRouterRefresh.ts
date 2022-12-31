import { useRouter } from 'next/router';

export default function useRouterRefresh() {
  const router = useRouter();
  return () => {
    router.replace(router.asPath);
  };
}
