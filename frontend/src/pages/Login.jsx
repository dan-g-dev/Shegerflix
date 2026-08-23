import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 sm:px-6">
      <div className="w-full rounded-lg bg-sheger-surface p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="mt-1 text-sm text-sheger-muted">Demo: admin@shegerflix.et or sara@shegerflix.et / Password123!</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sheger-text/85">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md bg-sheger-card border border-white/10 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-sheger-red"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-sheger-text/85">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md bg-sheger-card border border-white/10 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-sheger-red"
            />
          </div>

          {error && <p className="text-sm text-sheger-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-sheger-red py-2.5 text-base font-semibold hover:bg-sheger-red/90 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-5 text-sm text-sheger-muted">
          New to ShegerFlix?{' '}
          <Link to="/register" className="text-sheger-yellow hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
