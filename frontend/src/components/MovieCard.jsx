import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMyList } from '../context/MyListContext';
import { useToast } from '../context/ToastContext';

const FALLBACK_POSTER = 'https://placehold.co/300x450/1c1c26/9a9aa5?text=ShegerFlix';

export default function MovieCard({ title, className = '' }) {
  const [src, setSrc] = useState(title.poster_url || FALLBACK_POSTER);
  const [popping, setPopping] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isSaved, toggle } = useMyList();
  const { show } = useToast();
  const navigate = useNavigate();
  const saved = isSaved(title.id);

  async function handleHeartClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      show('Sign in to save titles to My List.', 'info');
      navigate('/login');
      return;
    }
    try {
      const nowSaved = await toggle(title.id);
      setPopping(true);
      setTimeout(() => setPopping(false), 400);
      show(nowSaved ? `Added "${title.title}" to My List` : `Removed "${title.title}" from My List`, 'success');
    } catch {
      show('Something went wrong. Please try again.', 'error');
    }
  }

  return (
    <Link
      to={`/title/${title.slug}`}
      className={`group w-full block transition-transform duration-300 ease-out hover:-translate-y-2 hover:scale-110 hover:z-20 relative ${className}`}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-sheger-card shadow-none group-hover:shadow-2xl group-hover:shadow-black/60 transition-shadow duration-300">
        <img
          src={src}
          onError={() => setSrc(FALLBACK_POSTER)}
          alt={title.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />

        {title.rating > 0 && (
          <span className="absolute top-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-sheger-yellow">
            ★ {Number(title.rating).toFixed(1)}
          </span>
        )}

        {/* Animated heart / My List toggle */}
        <button
          onClick={handleHeartClick}
          aria-label={saved ? 'Remove from My List' : 'Add to My List'}
          className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90"
        >
          <svg
            width="13" height="13" viewBox="0 0 24 24"
            fill={saved ? '#c8352d' : 'none'}
            stroke={saved ? '#c8352d' : '#f2f2f5'}
            strokeWidth="2.2"
            className={popping ? 'heart-pop' : ''}
          >
            <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.3 1.6 6.8 4.6 5.4c2.2-1 4.6-.2 5.9 1.7l1.5 2.1 1.5-2.1c1.3-1.9 3.7-2.7 5.9-1.7 3 1.4 3.6 4.9 1.9 7.5C18.7 16.65 12 21 12 21z" />
          </svg>
        </button>

        {/* Hover info overlay — mini "preview card" with extra details + play */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sheger-text text-sheger-bg text-[10px]">▶</span>
            <span className="text-[10px] text-sheger-text/90">{title.type === 'series' ? `${title.seasons || 1} Season(s)` : `${title.duration_minutes || '—'} min`}</span>
          </div>
          {title.genres?.length > 0 && (
            <p className="text-[10px] text-sheger-muted truncate">{title.genres.slice(0, 2).join(' · ')}</p>
          )}
        </div>
      </div>
      <p className="mt-1.5 truncate text-xs sm:text-sm font-medium text-sheger-text/90">{title.title}</p>
      <p className="text-[11px] text-sheger-muted">{title.release_year} · {title.type === 'series' ? 'Series' : 'Movie'}</p>
    </Link>
  );
}
