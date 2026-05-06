import { CheckCircle2, Clock3, FileText, XCircle } from 'lucide-react';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import { StatCard } from '../../components/ui/StatCard';
import { useAsync } from '../../hooks/useAsync';
import { contentService } from '../../services/content.service';

export function PrincipalDashboardPage() {
  const loadSummary = useCallback(() => contentService.getSummary(), []);
  const { data: summary, loading, error } = useAsync(loadSummary);

  return (
    <>
      <PageHeader
        actions={
          <Link to="/principal/approvals">
            <Button>Review pending</Button>
          </Link>
        }
        description="A school-wide view of uploaded content and approval progress."
        title="Principal Dashboard"
      />

      {loading ? <SkeletonCards /> : null}
      {error ? <div className="card p-4 text-sm font-bold text-rose-700">{error}</div> : null}
      {summary && !loading ? (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard icon={FileText} label="Total uploaded" tone="blue" value={summary.total} />
          <StatCard icon={Clock3} label="Pending" tone="amber" value={summary.pending} />
          <StatCard icon={CheckCircle2} label="Approved" tone="green" value={summary.approved} />
          <StatCard icon={XCircle} label="Rejected" tone="red" value={summary.rejected} />
        </div>
      ) : null}
    </>
  );
}
