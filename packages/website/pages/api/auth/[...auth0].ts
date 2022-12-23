import { handleAuth, handleLogout } from '@auth0/nextjs-auth0';

export default handleAuth({
  logout: handleLogout({ returnTo: '/logout' })
});
