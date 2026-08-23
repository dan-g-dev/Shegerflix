import { useEffect, useState } from 'react';
import api from '../api/client';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const LANGUAGES = ['All', 'Amharic', 'Afaan Oromoo', 'Tigrinya', 'International'];

/** Shared page for /movies and /series, distinguished by the `type` prop. */
export default function Browse({ type, heading }) {
  const [titles, setTitles] = useState(null);
  const [language, setLanguage] = useState('All');

  useEffect(() => {
    setTitles(null);
    const params = { type };
    if (language !== 'All') params.language = language;
    api.get('/titles', { params }).then(({ data }) => setTitles(data.titles)).catch(() => setTitles([]));
  }, [type, language]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">{heading}</h1>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                language === lang ? 'bg-sheger-red text-white' : 'bg-sheger-card text-sheger-text/80 hover:bg-sheger-card/70'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {titles === null && <SkeletonGrid />}
        {titles?.length === 0 && <EmptyState title="No titles found" message="Try a different language filter." />}
        {titles?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {titles.map((t) => (
              <MovieCard key={t.id} title={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
