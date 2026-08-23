import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = params.get('q');
    if (q) {
      setQuery(q);
      runSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(q) {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get('/titles/search', { params: { q } });
      setResults(data.titles);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setParams(query ? { q: query } : {});
    runSearch(query);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles, genres, or descriptions..."
          className="w-full rounded-md bg-sheger-card border border-white/10 px-4 py-3 text-sm sm:text-base text-sheger-text placeholder:text-sheger-muted focus:outline-none focus:ring-2 focus:ring-sheger-red"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-sheger-red px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold hover:bg-sheger-red/90"
        >
          Search
        </button>
      </form>

      <div className="mt-6">
        {loading && <SkeletonGrid count={10} />}

        {!loading && searched && results.length === 0 && (
          <EmptyState title="No results" message={`Nothing matched "${query}". Try a different title or genre.`} />
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((t) => (
              <MovieCard key={t.id} title={t} />
            ))}
          </div>
        )}

        {!searched && (
          <p className="text-center text-sheger-muted py-10">Search across all Amharic, Afaan Oromoo, Tigrinya, and international titles.</p>
        )}
      </div>
    </div>
  );
}
