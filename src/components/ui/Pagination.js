import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, totalPages, itemCount, visibleCount, onPageChange }) {
  if (itemCount <= visibleCount && totalPages <= 1) return null;

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-bold text-slate-600">
        Showing {visibleCount} of {itemCount} records
      </p>
      <div className="flex gap-2">
        <button className="btn btn-secondary" disabled={page === 1} onClick={() => onPageChange(page - 1)} type="button">
          <ChevronLeft size={16} aria-hidden="true" />
          Previous
        </button>
        <span className="grid min-h-10 place-items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-slate-800">
          {page} / {totalPages}
        </span>
        <button className="btn btn-secondary" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} type="button">
          Next
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
