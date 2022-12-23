import Link from 'next/link';

export default function Login() {
  return (
    <main>
      <h1>kaaaxcreators&apos; Schulmanager</h1>
      <h2>Alternativer Client für Schulmanager Online</h2>
      <Link href="/api/auth/login">Einloggen</Link>
    </main>
  );
}
