import { Check, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ContentPreview } from '../../components/content/ContentPreview';
import { ContentTable } from '../../components/content/ContentTable';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { FormField } from '../../components/ui/FormField';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonRows } from '../../components/ui/Skeleton';
import { useAsync } from '../../hooks/useAsync';
import { approvalService } from '../../services/approval.service';
import { contentService } from '../../services/content.service';
import { CONTENT_STATUS } from '../../utils/constants';

export function PendingApprovalPage() {
  const [rejectingItem, setRejectingItem] = useState(null);
  const [reason, setReason] = useState('');
  const [busyId, setBusyId] = useState('');
  const loadPending = useCallback(() => contentService.listAll({ status: CONTENT_STATUS.PENDING }), []);
  const { data: items = [], loading, error, execute } = useAsync(loadPending, { initialData: [] });

  const selected = useMemo(() => items[0], [items]);

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
        <ContentTable
          actions={(item) => (
            <div className="flex flex-wrap gap-2">
              <Button loading={busyId === item.id} onClick={() => approve(item)}>
                <Check size={16} aria-hidden="true" />
                Approve
              </Button>
              <Button disabled={busyId === item.id} onClick={() => setRejectingItem(item)} variant="danger">
                <X size={16} aria-hidden="true" />
                Reject
              </Button>
            </div>
          )}
          items={items}
          showTeacher
        />
      ) : null}

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
