import { useEffect, useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import ActivityFeed from '../../components/analytics/ActivityFeed';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import SearchInput from '../../components/ui/SearchInput';
import Spinner from '../../components/ui/Spinner';
import { getLogs } from '../../services/analytics.api';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ action: '', userId: '', page: 1 });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getLogs(filters).then((res) => {
      setLogs(res.data);
      setPagination(res.pagination);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filters.page]);

  return (
    <PageWrapper title="Activity Logs" eyebrow="Audit trail">
      <section className="mb-5 flex flex-wrap gap-3 rounded-xl border border-outline-variant bg-white p-4 shadow-sm">
        <SearchInput value={filters.action} onChange={(action) => setFilters((current) => ({ ...current, action, page: 1 }))} placeholder="Action type, e.g. TASK_CREATED" className="min-w-72 flex-1" />
        <SearchInput value={filters.userId} onChange={(userId) => setFilters((current) => ({ ...current, userId, page: 1 }))} placeholder="Performed by user id" className="min-w-64" />
        <Button variant="secondary" onClick={load}>Apply filters</Button>
      </section>
      {loading ? <Spinner label="Loading audit trail" /> : logs.length ? <ActivityFeed items={logs} /> : <EmptyState title="No audit events found" body="Adjust filters or perform an action to create audit logs." />}
      {pagination ? (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-outline-variant bg-white p-3 text-sm text-on-surface-variant">
          <span>Page {pagination.page} of {pagination.totalPages} · {pagination.total} events</span>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={pagination.page <= 1} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}>Previous</Button>
            <Button variant="secondary" disabled={pagination.page >= pagination.totalPages} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>Next</Button>
          </div>
        </div>
      ) : null}
    </PageWrapper>
  );
}
