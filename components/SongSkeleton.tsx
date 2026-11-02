export default function SongSkeleton() {
  return (
    <div className="rounded-xl bg-dark-tertiary/40 overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-square bg-dark-tertiary/60 animate-shimmer" />

      {/* Text skeleton */}
      <div className="p-4 space-y-2">
        <div className="h-4 bg-dark-tertiary/60 rounded animate-shimmer" />
        <div className="h-3 bg-dark-tertiary/60 rounded w-2/3 animate-shimmer" />
      </div>
    </div>
  );
}

export function TrackListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <div className="w-8 h-4 bg-dark-tertiary/60 rounded animate-shimmer" />
          <div className="h-10 w-10 bg-dark-tertiary/60 rounded animate-shimmer flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="h-4 bg-dark-tertiary/60 rounded animate-shimmer w-3/4" />
            <div className="h-3 bg-dark-tertiary/60 rounded animate-shimmer w-1/2" />
          </div>
          <div className="w-12 h-4 bg-dark-tertiary/60 rounded animate-shimmer" />
        </div>
      ))}
    </div>
  );
}
