import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function Profile() {
  const { user } = useAuth();
  const [history, setHistory] = useState(null);

  useEffect(() => {
    api.get('/history').then(({ data }) => setHistory(data.history)).catch(() => setHistory([]));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-sheger-green flex items-center justify-center text-2xl font-bold shrink-0">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{user?.name}</h1>
          <p className="text-sm text-sheger-muted">{user?.email}</p>
          {user?.role === 'admin' && (
            <span className="mt-1 inline-block rounded bg-sheger-green/20 px-2 py-0.5 text-xs text-sheger-green">Admin</span>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/my-list" className="rounded bg-sheger-card px-4 py-2 text-sm font-medium hover:bg-sheger-card/70">My List</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="rounded bg-sheger-card px-4 py-2 text-sm font-medium hover:bg-sheger-card/70">Admin Dashboard</Link>
        )}
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold">Watch History</h2>
      {history === null && <LoadingSpinner />}
      {history?.length === 0 && (
        <EmptyState title="No watch history yet" message="Titles you play will show up here." />
      )}
      {history?.length > 0 && (
        <ul className="divide-y divide-white/5 rounded-lg bg-sheger-surface">
          {history.map((h) => (
            <li key={h.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <Link to={`/title/${h.slug}`} className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{h.title}</p>
                <p className="text-xs text-sheger-muted">
                  {h.completed ? 'Watched' : `${Math.round((h.progress_seconds / 60))} min watched`} · {new Date(h.last_watched_at).toLocaleDateString()}
                </p>
              </Link>
              {h.completed && <span className="shrink-0 text-xs text-sheger-green">✓ Completed</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
