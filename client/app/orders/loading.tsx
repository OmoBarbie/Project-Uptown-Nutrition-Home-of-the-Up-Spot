export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-2">
          <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
