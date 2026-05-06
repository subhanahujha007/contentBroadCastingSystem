import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContentTable } from '../../components/content/ContentTable';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonRows } from '../../components/ui/Skeleton';
import { useAsync } from '../../hooks/useAsync';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { contentService } from '../../services/content.service';
import { STATUS_OPTIONS } from '../../utils/constants';

const PAGE_SIZE = 25;

export function AllContentPage() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);
  const loadItems = useCallback(() => contentService.listAll({ status, search: debouncedSearch }), [debouncedSearch, status]);
  const { data: items = [], loading, error } = useAsync(loadItems, { initialData: [] });

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const visibleItems = useMemo(() => items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [items, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  return (
    <>
      <PageHeader description="Search and filter the complete content archive." title="All Content" />

      <div className="card mb-5 grid gap-3 p-4 md:grid-cols-[220px_1fr]">
        <select className="input" onChange={(event) => setStatus(event.target.value)} value={status}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input className="input" onChange={(event) => setSearch(event.target.value)} placeholder="Search title, subject, or teacher" value={search} />
      </div>

      {loading ? <SkeletonRows /> : null}
      {error ? <div className="card p-4 text-sm font-bold text-rose-700">{error}</div> : null}
      {!loading && !error && items.length === 0 ? <EmptyState description="Try changing the search or status filter." title="No matching content" /> : null}
      {!loading && !error && items.length > 0 ? (
        <>
          <ContentTable items={visibleItems} showTeacher />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-slate-600">
              Showing {visibleItems.length} of {items.length} records
            </p>
            <div className="flex gap-2">
              <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage((value) => value - 1)} type="button">
                Previous
              </button>
              <span className="grid min-h-10 place-items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold">
                {page} / {totalPages}
              </span>
              <button className="btn btn-secondary" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)} type="button">
                Next
              </button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
