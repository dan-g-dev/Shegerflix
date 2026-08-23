import { useEffect, useState } from 'react';
import api from '../api/client';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [selected, setSelected] = useState(null);
  const [titles, setTitles] = useState(null);

  useEffect(() => {
    api.get('/titles/genres').then(({ data }) => setGenres(data.genres)).catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    if (!selected) { setTitles(null); return; }
    setTitles(null);
    api.get('/titles', { params: { genre: selected } }).then(({ data }) => setTitles(data.titles)).catch(() => setTitles([]));
  }, [selected]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-5">Genres</h1>

      <div className="flex flex-wrap gap-2">
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelected(g.name)}
            className={`rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              selected === g.name ? 'bg-sheger-red text-white' : 'bg-sheger-card text-sheger-text/80 hover:bg-sheger-card/70'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {selected && titles === null && <SkeletonGrid />}
        {selected && titles?.length === 0 && <EmptyState title="No titles in this genre yet" />}
        {selected && titles?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {titles.map((t) => (
              <MovieCard key={t.id} title={t} />
            ))}
          </div>
        )}
        {!selected && <p className="text-sheger-muted text-center py-10">Pick a genre to see matching titles.</p>}
      </div>
    </div>
  );
}
