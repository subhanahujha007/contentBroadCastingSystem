import { useCallback } from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonRows } from '../../components/ui/Skeleton';
import { ContentTable } from '../../components/content/ContentTable';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { contentService } from '../../services/content.service';

export function MyContentPage() {
  const { user } = useAuth();
  const loadItems = useCallback(() => contentService.listForTeacher(user.id), [user.id]);
  const { data: items = [], loading, error } = useAsync(loadItems, { initialData: [] });

  return (
    <>
      <PageHeader description="Review all submitted content and principal feedback." title="My Content" />

      {loading ? <SkeletonRows /> : null}
      {error ? <div className="card p-4 text-sm font-bold text-rose-700">{error}</div> : null}
      {!loading && !error && items.length === 0 ? (
        <EmptyState description="Upload your first broadcast item to send it for approval." title="No uploaded content" />
      ) : null}
      {!loading && !error && items.length > 0 ? <ContentTable items={items} /> : null}
    </>
  );
}
