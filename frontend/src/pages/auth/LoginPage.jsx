import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { demoAccounts } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: 'admin@clientpulse.dev', password: 'Admin@123' }
  });

  if (user) return <Navigate to={`/${user.role === 'admin' ? 'admin' : user.role}`} replace />;

  const submit = async (values) => {
    setLoading(true);
    try {
      const signedIn = await login(values);
      navigate(`/${signedIn.role === 'admin' ? 'admin' : signedIn.role}`, { replace: true });
    } catch (error) {
      toast.error(error?.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (account) => {
    setValue('email', account.email, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    setValue('password', account.password, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1fr_520px]">
      <section className="relative hidden overflow-hidden bg-inverse-surface p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-container font-black">CP</span>
            <p className="text-2xl font-black">ClientPulse</p>
          </div>
          <h1 className="mt-24 max-w-2xl text-5xl font-black leading-tight">Agency delivery intelligence without spreadsheet chaos.</h1>
          <p className="mt-5 max-w-xl text-base text-surface-variant">Role-aware project tracking, auditability, health scoring, and client transparency in one SaaS console.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {['RBAC portal', 'Dual database audit trail', 'Health scoring'].map((item) => <div key={item} className="rounded-lg bg-white/10 p-4 font-semibold">{item}</div>)}
        </div>
      </section>
      <section className="flex items-center bg-background p-6">
        <div className="mx-auto w-full max-w-md rounded-xl border border-outline-variant bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary-container text-white"><ShieldCheck className="h-5 w-5" /></span>
            <div><h2 className="text-xl font-black">Sign in</h2><p className="text-sm text-on-surface-variant">Use a seeded role account.</p></div>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
            <Input label="Email" type="email" autoComplete="email" {...register('email', { required: 'Email required' })} error={errors.email?.message} />
            <Input label="Password" type="password" autoComplete="current-password" {...register('password', { required: 'Password required' })} error={errors.password?.message} />
            <Button type="submit" loading={loading}>Continue</Button>
          </form>
          <div className="mt-5 grid gap-2">
            {demoAccounts.map((account) => (
              <button key={account.email} type="button" onClick={() => fillDemoAccount(account)} className="rounded-lg border border-outline-variant px-3 py-2 text-left text-xs transition hover:bg-surface-container-low">
                <b>{account.role}</b> · {account.email}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
