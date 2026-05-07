export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}
