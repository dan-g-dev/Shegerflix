/**
 * components/Skeleton.jsx
 * ------------------------------------------------------------
 * Shimmering placeholder blocks shown while data is loading,
 * instead of (or alongside) a spinner. Shapes mirror the real
 * content so the page doesn't "jump" once data arrives.
 * ------------------------------------------------------------
 */

export function SkeletonCard() {
  return (
    <div className="w-full">
      <div className="skeleton-shimmer aspect-[2/3] w-full rounded-md bg-sheger-card" />
      <div className="skeleton-shimmer mt-1.5 h-3 w-4/5 rounded bg-sheger-card" />
      <div className="skeleton-shimmer mt-1.5 h-2.5 w-2/5 rounded bg-sheger-card" />
    </div>
  );
}

export function SkeletonRow({ count = 6 }) {
  return (
    <div className="mb-8">
      <div className="skeleton-shimmer mb-2.5 mx-4 sm:mx-6 lg:mx-8 h-5 w-40 rounded bg-sheger-card" />
      <div className="flex gap-3 overflow-hidden px-4 sm:px-6 lg:px-8">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="shrink-0 w-32 sm:w-40 md:w-44 lg:w-48">
            <SkeletonCard />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="skeleton-shimmer h-[46vh] min-h-[280px] sm:h-[56vh] md:h-[68vh] w-full bg-sheger-card" />
  );
}
