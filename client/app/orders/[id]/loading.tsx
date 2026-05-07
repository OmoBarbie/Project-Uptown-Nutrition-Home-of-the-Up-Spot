export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}
