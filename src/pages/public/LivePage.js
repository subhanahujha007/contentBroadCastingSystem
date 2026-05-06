import { RefreshCcw, Wifi } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ContentPreview } from '../../components/content/ContentPreview';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAsync } from '../../hooks/useAsync';
import { contentService } from '../../services/content.service';
import { formatDateTime } from '../../utils/date';

export function LivePage() {
  const { teacherId } = useParams();
  const loadLiveContent = useCallback(() => contentService.getLiveContent(teacherId), [teacherId]);
  const { data: item, loading, error, execute } = useAsync(loadLiveContent, { initialData: null });

  useEffect(() => {
    const timer = setInterval(() => {
      execute().catch(() => {});
    }, 15000);
    return () => clearInterval(timer);
  }, [execute]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <section className="mx-auto w-full max-w-5xl">
        <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-600">
              <Wifi size={22} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold">Live Broadcast</h1>
              <p className="text-sm text-slate-300">Teacher channel: {teacherId}</p>
            </div>
          </div>
          <button className="btn border-slate-700 bg-slate-900 text-white hover:bg-slate-800" onClick={() => execute().catch(() => {})} type="button">
            <RefreshCcw size={16} aria-hidden="true" />
            Refresh
          </button>
        </header>

        {loading ? <div className="skeleton aspect-video w-full" /> : null}
        {error ? <div className="rounded-lg bg-rose-950 p-4 text-sm font-bold text-rose-100">{error}</div> : null}
        {!loading && !error && !item ? (
          <div className="text-slate-900">
            <EmptyState description="This public page automatically checks again every 15 seconds." title="No content available" />
          </div>
        ) : null}
        {!loading && !error && item ? (
          <article className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
            <ContentPreview item={item} />
            <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-start">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <StatusBadge status="active" />
                  <span className="badge bg-white text-slate-900">{item.subject}</span>
                </div>
                <h2 className="text-3xl font-extrabold">{item.title}</h2>
                {item.description ? <p className="mt-3 text-slate-300">{item.description}</p> : null}
              </div>
              <div className="rounded-lg bg-slate-950 p-4 text-sm text-slate-300">
                <p className="font-bold text-white">Schedule</p>
                <p className="mt-2">{formatDateTime(item.startTime)}</p>
                <p>{formatDateTime(item.endTime)}</p>
                <p className="mt-2">Rotation: {item.rotationDuration}s</p>
              </div>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
