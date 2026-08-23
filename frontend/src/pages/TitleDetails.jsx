import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useMyList } from '../context/MyListContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const FALLBACK_BACKDROP = 'https://placehold.co/1280x720/15151c/9a9aa5?text=ShegerFlix';
const FALLBACK_POSTER = 'https://placehold.co/300x450/1c1c26/9a9aa5?text=ShegerFlix';

export default function TitleDetails() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { isSaved, toggle } = useMyList();
  const { show } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    setTitle(null);
    setNotFound(false);
    api
      .get(`/titles/${slug}`)
      .then(({ data }) => setTitle(data.title))
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
      });
  }, [slug]);

  async function toggleMyList() {
    if (!isAuthenticated) {
      show('Sign in to save titles to My List.', 'info');
      navigate('/login');
      return;
    }
    setBusy(true);
    try {
      const nowSaved = await toggle(title.id);
      setPopping(true);
      setTimeout(() => setPopping(false), 400);
      show(nowSaved ? 'Added to My List' : 'Removed from My List', 'success');
    } catch {
      show('Something went wrong. Please try again.', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function markWatched() {
    if (!isAuthenticated) {
      show('Sign in to track your watch history.', 'info');
      navigate('/login');
      return;
    }
    try {
      await api.post('/history', {
        titleId: title.id,
        progressSeconds: (title.duration_minutes || 20) * 60,
        completed: true,
      });
      show('Added to your watch history.', 'success');
    } catch {
      show('Could not save progress.', 'error');
    }
  }

  if (notFound) {
    return (
      <EmptyState
        title="Title not found"
        message="This movie or series may have been removed."
        action={<Link to="/" className="text-sheger-yellow underline">Back to Home</Link>}
      />
    );
  }

  if (!title) return <LoadingSpinner full />;

  const saved = isSaved(title.id);

  return (
    <div>
      <div className="relative h-[32vh] min-h-[200px] sm:h-[40vh] w-full overflow-hidden">
        <img
          src={title.backdrop_url || FALLBACK_BACKDROP}
          onError={(e) => { e.currentTarget.src = FALLBACK_BACKDROP; }}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sheger-bg to-transparent" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-10">
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
          <img
            src={title.poster_url || FALLBACK_POSTER}
            onError={(e) => { e.currentTarget.src = FALLBACK_POSTER; }}
            alt={title.title}
            className="w-32 sm:w-48 md:w-56 rounded-md shadow-xl mx-auto sm:mx-0 shrink-0 transition-transform duration-300 hover:scale-105"
          />

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{title.title}</h1>
            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-1 text-sm text-sheger-muted">
              <span>{title.release_year}</span>
              <span>·</span>
              <span>{title.type === 'series' ? `${title.seasons || 1} Season(s)` : `${title.duration_minutes || '—'} min`}</span>
              <span>·</span>
              <span>{title.language}</span>
              <span>·</span>
              <span className="text-sheger-yellow">★ {Number(title.rating).toFixed(1)}</span>
            </div>

            {title.genres?.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                {title.genres.map((g) => (
                  <span key={g} className="rounded-full bg-sheger-card px-3 py-1 text-xs text-sheger-text/80">
                    {g}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-4 text-sm sm:text-base text-sheger-text/85 max-w-2xl">{title.description}</p>

            <div className="mt-5 flex flex-wrap justify-center sm:justify-start gap-3">
              <button
                onClick={markWatched}
                className="rounded bg-sheger-text px-5 py-2.5 text-sm sm:text-base font-semibold text-sheger-bg hover:bg-sheger-text/90 transition-transform hover:scale-105"
              >
                ▶ Play
              </button>
              <button
                onClick={toggleMyList}
                disabled={busy}
                className="flex items-center gap-2 rounded bg-white/10 px-5 py-2.5 text-sm sm:text-base font-semibold hover:bg-white/20 disabled:opacity-50 transition-transform hover:scale-105"
              >
                <svg
                  width="16" height="16" viewBox="0 0 24 24"
                  fill={saved ? '#c8352d' : 'none'}
                  stroke={saved ? '#c8352d' : '#f2f2f5'}
                  strokeWidth="2.2"
                  className={popping ? 'heart-pop' : ''}
                >
                  <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.3 1.6 6.8 4.6 5.4c2.2-1 4.6-.2 5.9 1.7l1.5 2.1 1.5-2.1c1.3-1.9 3.7-2.7 5.9-1.7 3 1.4 3.6 4.9 1.9 7.5C18.7 16.65 12 21 12 21z" />
                </svg>
                {saved ? 'In My List' : 'My List'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
