import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="mb-4 text-2xl font-bold">Not Found</h2>
      <p className="mb-4">Could not find requested resource</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Return Home
      </Link>
    </div>
  );
}
