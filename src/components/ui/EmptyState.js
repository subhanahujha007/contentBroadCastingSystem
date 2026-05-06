import { Inbox } from 'lucide-react';

export function EmptyState({ title = 'No content available', description }) {
  return (
    <div className="card grid place-items-center px-5 py-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-100 text-slate-500">
        <Inbox size={24} aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-extrabold text-slate-900">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-sm text-slate-600">{description}</p> : null}
    </div>
  );
}
