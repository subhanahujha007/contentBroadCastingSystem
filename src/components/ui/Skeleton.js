export function SkeletonRows({ rows = 5 }) {
  return (
    <div className="card p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="mb-3 grid grid-cols-[56px_1fr_120px] gap-3 last:mb-0">
          <div className="skeleton h-12" />
          <div className="skeleton h-12" />
          <div className="skeleton h-12" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="skeleton h-28" />
      ))}
    </div>
  );
}
