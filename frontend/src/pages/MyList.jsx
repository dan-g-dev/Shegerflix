import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

export default function MyList() {
  const [titles, setTitles] = useState(null);

  useEffect(() => {
    api.get('/mylist').then(({ data }) => setTitles(data.titles)).catch(() => setTitles([]));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-5">My List</h1>

      {titles === null && <SkeletonGrid />}

      {titles?.length === 0 && (
        <EmptyState
          title="Your list is empty"
          message="Save movies and series to watch later."
          action={<Link to="/" className="text-sheger-yellow underline">Browse titles</Link>}
        />
      )}

      {titles?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {titles.map((t) => (
            <MovieCard key={t.id} title={t} />
          ))}
        </div>
      )}
    </div>
  );
}
