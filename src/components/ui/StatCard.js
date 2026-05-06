export function StatCard({ icon: Icon, label, value, tone = 'blue' }) {
  const toneClass = {
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-rose-50 text-rose-700',
  }[tone];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{value ?? 0}</p>
        </div>
        {Icon ? (
          <span className={`grid h-11 w-11 place-items-center rounded-lg ${toneClass}`}>
            <Icon size={22} aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </div>
  );
}
