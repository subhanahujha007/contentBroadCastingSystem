import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Megaphone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/ui/FormField';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export function LoginPage() {
  const { isAuthenticated, login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'teacher@school.com', password: '' },
  });

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'principal' ? '/principal/dashboard' : '/teacher/dashboard'} replace />;
  }

  async function onSubmit(values) {
    try {
      const session = await login(values);
      toast.success(`Welcome, ${session.user.name}`);
      const destination = session.user.role === 'principal' ? '/principal/dashboard' : '/teacher/dashboard';
      navigate(location.state?.from || destination, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-8">
      <section className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
        <div className="flex min-h-[520px] flex-col justify-between rounded-lg bg-slate-950 p-8 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-blue-600">
              <Megaphone size={24} aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-extrabold">EduCast</p>
              <p className="text-sm text-slate-300">Content Broadcasting System</p>
            </div>
          </div>
          <div>
            <h1 className="max-w-xl text-4xl font-extrabold leading-tight sm:text-5xl">Broadcast classroom content after the right approval.</h1>
            <p className="mt-4 max-w-xl text-slate-300">
              Teachers schedule subject visuals, principals review submissions, and students see currently active broadcasts from a public link.
            </p>
          </div>
          <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
            <p>Teacher: teacher@school.com</p>
            <p>Principal: principal@school.com</p>
            <p>Password: password123</p>
            <p>Password: password123</p>
          </div>
        </div>

        <form className="card p-6 sm:p-8" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-extrabold text-slate-950">Sign in</h2>

          <div className="mt-7 grid gap-4">
            <FormField error={errors.email?.message} label="Email">
              <input className="input" placeholder="name@school.com" {...register('email')} />
            </FormField>
            <FormField error={errors.password?.message} label="Password">
              <input className="input" placeholder="Enter password" type="password" {...register('password')} />
            </FormField>
          </div>

          <Button className="mt-6 w-full" loading={isSubmitting} type="submit">
            <LogIn size={17} aria-hidden="true" />
            Sign in
          </Button>
        </form>
      </section>
    </main>
  );
}
