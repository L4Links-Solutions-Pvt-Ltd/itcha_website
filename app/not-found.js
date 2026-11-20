import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="section"><div className="wrap narrow"><h1>Page not found</h1><p><Link href="/">Go to the home page</Link></p></div></main>
  );
}
