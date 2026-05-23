import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Power, Trash2 } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import Input from '../../components/ui/Input';
import SearchInput from '../../components/ui/SearchInput';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { deleteUser, inviteClient, listUsers, updateUserStatus } from '../../services/user.api';
import { register } from '../../services/auth.api';
import { listProjects } from '../../services/project.api';
import { useForm } from 'react-hook-form';

function InviteForm({ mode, projects, onSubmit, loading }) {
  const { register: field, handleSubmit, formState: { errors } } = useForm({ defaultValues: { role: 'member', password: mode === 'client' ? 'Client@123' : 'Member@123' } });
  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Name" {...field('name', { required: 'Name required' })} error={errors.name?.message} />
      <Input label="Email" type="email" {...field('email', { required: 'Email required' })} error={errors.email?.message} />
      <Input label="Temporary password" type="password" {...field('password', { required: 'Password required', minLength: 8 })} error={errors.password?.message} />
      {mode === 'client' ? (
        <label className="grid gap-1.5 text-sm font-medium text-on-surface">
          Linked project
          <select className="h-10 rounded-lg border border-outline-variant bg-white px-3" {...field('projectId', { required: true })}>
            <option value="">Select project</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
          </select>
        </label>
      ) : (
        <label className="grid gap-1.5 text-sm font-medium text-on-surface">
          Role
          <select className="h-10 rounded-lg border border-outline-variant bg-white px-3" {...field('role')}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      )}
      <Button loading={loading}>{mode === 'client' ? 'Invite client' : 'Invite member'}</Button>
    </form>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ search: '', role: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(null);
  const [saving, setSaving] = useState(false);

  const params = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value)), [filters]);
  const load = () => {
    setLoading(true);
    Promise.all([listUsers(params), listProjects()])
      .then(([userRes, projectRes]) => {
        setUsers(userRes.data);
        setProjects(projectRes.data);
      })
      .catch(() => toast.error('Team data could not be loaded'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [params.search, params.role, params.status]);

  const changeStatus = async (user) => {
    const status = user.status === 'active' ? 'inactive' : 'active';
    await updateUserStatus(user.id, status);
    toast.success('User status updated');
    load();
  };

  const removeUser = async (user) => {
    await deleteUser(user.id);
    toast.success('User deleted');
    load();
  };

  const submitInvite = async (payload) => {
    setSaving(true);
    try {
      if (drawer === 'client') await inviteClient(payload);
      else await register(payload);
      toast.success(drawer === 'client' ? 'Client invited' : 'Member invited');
      setDrawer(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrapper title="Team & Access" eyebrow="Admin" actions={<div className="flex gap-2"><Button variant="secondary" icon={Plus} onClick={() => setDrawer('client')}>Invite Client</Button><Button icon={Plus} onClick={() => setDrawer('member')}>Invite Member</Button></div>}>
      <section className="mb-5 flex flex-wrap gap-3 rounded-xl border border-outline-variant bg-white p-4 shadow-sm">
        <SearchInput value={filters.search} onChange={(search) => setFilters((current) => ({ ...current, search }))} placeholder="Search members..." className="min-w-64 flex-1" />
        <select className="h-10 rounded-lg border border-outline-variant bg-white px-3 text-sm" value={filters.role} onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))}>
          <option value="">Role: All</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
          <option value="client">Client</option>
        </select>
        <select className="h-10 rounded-lg border border-outline-variant bg-white px-3 text-sm" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
          <option value="">Status: All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </section>
      {loading ? <Spinner label="Loading team access" /> : users.length ? <Table rows={users} getRowKey={(row) => row.id} columns={[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role', render: (row) => <Badge color="blue">{row.role}</Badge> },
        { key: 'status', label: 'Status', render: (row) => <Badge color={row.status === 'active' ? 'green' : 'red'}>{row.status}</Badge> },
        { key: 'actions', label: 'Actions', render: (row) => <div className="flex gap-2"><Button variant="secondary" icon={Power} className="min-h-8 px-2" onClick={() => changeStatus(row)}>{row.status === 'active' ? 'Deactivate' : 'Activate'}</Button><Button variant="danger" icon={Trash2} className="min-h-8 px-2" onClick={() => removeUser(row)}>Delete</Button></div> }
      ]} /> : <EmptyState title="No users match these filters" />}
      <Drawer title={drawer === 'client' ? 'Invite client to portal' : 'Invite team member'} description="Creates a real account and sends the user into the RBAC flow." open={Boolean(drawer)} onClose={() => setDrawer(null)}>
        <InviteForm mode={drawer} projects={projects} onSubmit={submitInvite} loading={saving} />
      </Drawer>
    </PageWrapper>
  );
}
