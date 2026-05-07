'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-gray-500 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="bg-green-600 text-white px-5 py-2.5 rounded-md font-medium"
      >
        Try again
      </button>
    </div>
  );
}
