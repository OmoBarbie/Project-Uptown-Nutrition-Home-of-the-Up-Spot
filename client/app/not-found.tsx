import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-bold text-gray-200 mb-4">404</p>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="bg-green-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-green-700">
        Go home
      </Link>
    </div>
  );
}
