import { Check, Eye, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { BroadcastPreviewModal } from '../../components/content/BroadcastPreviewModal';
import { ContentPreview } from '../../components/content/ContentPreview';
import { ContentTable } from '../../components/content/ContentTable';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { FormField } from '../../components/ui/FormField';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonRows } from '../../components/ui/Skeleton';
import { useAsync } from '../../hooks/useAsync';
import { approvalService } from '../../services/approval.service';
import { contentService } from '../../services/content.service';
import { CONTENT_STATUS } from '../../utils/constants';

const PAGE_SIZE = 15;

export function PendingApprovalPage() {
  const [rejectingItem, setRejectingItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [reason, setReason] = useState('');
  const [busyId, setBusyId] = useState('');
  const [page, setPage] = useState(1);
  const loadPending = useCallback(() => contentService.listAll({ status: CONTENT_STATUS.PENDING }), []);
  const { data: items = [], loading, error, execute } = useAsync(loadPending, { initialData: [] });

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const visibleItems = useMemo(() => items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [items, page]);
  const selected = useMemo(() => items[0], [items]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  async function approve(item) {
    setBusyId(item.id);
    try {
      await approvalService.approve(item.id);
      toast.success('Content approved.');
      await execute();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId('');
    }
  }

  async function reject() {
    if (!reason.trim()) {
      toast.error('Rejection reason is required.');
      return;
    }

    setBusyId(rejectingItem.id);
    try {
      await approvalService.reject(rejectingItem.id, reason);
      toast.success('Content rejected with feedback.');
      setRejectingItem(null);
      setReason('');
      await execute();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId('');
    }
  }

  return (
    <>
      <PageHeader description="Approve content or send it back with a clear reason." title="Pending Approval" />

      {selected && !loading ? (
        <section className="card mb-5 grid gap-5 p-5 lg:grid-cols-[360px_1fr]">
          <ContentPreview item={selected} />
          <div>
            <p className="text-sm font-bold text-slate-500">Next in queue</p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-950">{selected.title}</h2>
            <p className="mt-2 text-slate-600">{selected.description}</p>
            <p className="mt-4 text-sm font-bold text-slate-700">
              {selected.subject} by {selected.teacherName}
            </p>
          </div>
        </section>
      ) : null}

      {loading ? <SkeletonRows /> : null}
      {error ? <div className="card p-4 text-sm font-bold text-rose-700">{error}</div> : null}
      {!loading && !error && items.length === 0 ? <EmptyState description="Approved and rejected items remain available in All Content." title="No pending content" /> : null}
      {!loading && !error && items.length > 0 ? (
        <>
          <ContentTable
            actions={(item) => (
              <div className="flex flex-wrap gap-2">
                <Button loading={busyId === item.id} onClick={() => approve(item)}>
                  <Check size={16} aria-hidden="true" />
                  Approve
                </Button>
                <Button disabled={busyId === item.id} onClick={() => setPreviewItem(item)} variant="secondary">
                  <Eye size={16} aria-hidden="true" />
                  Preview
                </Button>
                <Button disabled={busyId === item.id} onClick={() => setRejectingItem(item)} variant="danger">
                  <X size={16} aria-hidden="true" />
                  Reject
                </Button>
              </div>
            )}
            items={visibleItems}
            showTeacher
          />
          <Pagination page={page} totalPages={totalPages} itemCount={items.length} visibleCount={visibleItems.length} onPageChange={setPage} />
        </>
      ) : null}

      <BroadcastPreviewModal item={previewItem} onClose={() => setPreviewItem(null)} open={Boolean(previewItem)} title="Pending approval preview" />

      <Modal
        footer={
          <>
            <Button onClick={() => setRejectingItem(null)} variant="secondary">
              Cancel
            </Button>
            <Button loading={busyId === rejectingItem?.id} onClick={reject} variant="danger">
              Reject content
            </Button>
          </>
        }
        onClose={() => setRejectingItem(null)}
        open={Boolean(rejectingItem)}
        title="Reject content"
      >
        <FormField label="Reason">
          <textarea
            className="input min-h-28"
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain what the teacher should fix"
            value={reason}
          />
        </FormField>
      </Modal>
    </>
  );
}
