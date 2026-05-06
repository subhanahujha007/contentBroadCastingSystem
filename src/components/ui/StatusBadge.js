import { CheckCircle2, Clock3, XCircle } from 'lucide-react';

export function StatusBadge({ status }) {
  const config = {
    pending: { className: 'bg-amber-50 text-amber-800', icon: Clock3 },
    approved: { className: 'bg-emerald-50 text-emerald-800', icon: CheckCircle2 },
    rejected: { className: 'bg-rose-50 text-rose-800', icon: XCircle },
    active: { className: 'bg-blue-50 text-blue-800', icon: CheckCircle2 },
    scheduled: { className: 'bg-slate-100 text-slate-700', icon: Clock3 },
    expired: { className: 'bg-zinc-100 text-zinc-700', icon: XCircle },
  }[status] || { className: 'bg-slate-100 text-slate-700', icon: Clock3 };

  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={14} aria-hidden="true" />
      {status || 'unknown'}
    </span>
  );
}
