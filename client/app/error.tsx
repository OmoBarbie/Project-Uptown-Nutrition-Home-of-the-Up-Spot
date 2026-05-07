'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-4">⚠️</p>
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-gray-500 mb-6">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="bg-green-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-green-700"
      >
        Try again
      </button>
    </div>
  );
}
