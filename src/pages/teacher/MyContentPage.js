import { Eye } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { BroadcastPreviewModal } from '../../components/content/BroadcastPreviewModal';
import { ContentTable } from '../../components/content/ContentTable';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonRows } from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { contentService } from '../../services/content.service';

const PAGE_SIZE = 15;

export function MyContentPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [previewItem, setPreviewItem] = useState(null);
  const loadItems = useCallback(() => contentService.listForTeacher(user.id), [user.id]);
  const { data: items = [], loading, error } = useAsync(loadItems, { initialData: [] });
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const visibleItems = useMemo(() => items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [items, page]);

  return (
    <>
      <PageHeader description="Review all submitted content and principal feedback." title="My Content" />

      {loading ? <SkeletonRows /> : null}
      {error ? <div className="card p-4 text-sm font-bold text-rose-700">{error}</div> : null}
      {!loading && !error && items.length === 0 ? (
        <EmptyState description="Upload your first broadcast item to send it for approval." title="No uploaded content" />
      ) : null}
      {!loading && !error && items.length > 0 ? (
        <>
          <ContentTable
            actions={(item) => (
              <Button onClick={() => setPreviewItem(item)} variant="secondary">
                <Eye size={16} aria-hidden="true" />
                Preview
              </Button>
            )}
            items={visibleItems}
          />
          <Pagination page={page} totalPages={totalPages} itemCount={items.length} visibleCount={visibleItems.length} onPageChange={setPage} />
        </>
      ) : null}
      <BroadcastPreviewModal item={previewItem} onClose={() => setPreviewItem(null)} open={Boolean(previewItem)} title="Content preview" />
    </>
  );
}
