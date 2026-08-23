import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 sm:px-6">
      <div className="w-full rounded-lg bg-sheger-surface p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Create Account</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-sheger-text/85">Name</label>
            <input
              id="name" required value={form.name} onChange={update('name')}
              className="mt-1 w-full rounded-md bg-sheger-card border border-white/10 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-sheger-red"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sheger-text/85">Email</label>
            <input
              id="email" type="email" required value={form.email} onChange={update('email')}
              className="mt-1 w-full rounded-md bg-sheger-card border border-white/10 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-sheger-red"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-sheger-text/85">Password</label>
            <input
              id="password" type="password" required value={form.password} onChange={update('password')}
              className="mt-1 w-full rounded-md bg-sheger-card border border-white/10 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-sheger-red"
            />
            <p className="mt-1 text-xs text-sheger-muted">At least 8 characters.</p>
          </div>

          {error && <p className="text-sm text-sheger-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-sheger-red py-2.5 text-base font-semibold hover:bg-sheger-red/90 disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-5 text-sm text-sheger-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-sheger-yellow hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
