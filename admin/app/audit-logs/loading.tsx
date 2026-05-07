import { range } from '@setemiojo/utils';

export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
      {range(8).map((i) => (
        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  );
}
