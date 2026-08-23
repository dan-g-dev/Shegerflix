import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { SkeletonHero, SkeletonRow } from '../components/Skeleton';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [continueWatching, setContinueWatching] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data } = await api.get('/titles/collections');
        if (cancelled) return;
        setData(data);
      } catch (err) {
        if (!cancelled) setError('Could not load ShegerFlix right now. Please try again shortly.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();

    if (isAuthenticated) {
      api
        .get('/history/continue-watching')
        .then(({ data }) => !cancelled && setContinueWatching(data.titles))
        .catch(() => {});
    }

    return () => { cancelled = true; };
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div>
        <SkeletonHero />
        <div className="mt-6 sm:mt-8">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  if (error) return <p className="px-4 py-10 text-center text-sheger-muted">{error}</p>;

  return (
    <div>
      <Hero titles={data?.hero || []} />
      <div className="mt-6 sm:mt-8">
        {continueWatching.length > 0 && (
          <MovieRow title="Continue Watching" titles={continueWatching} />
        )}
        {data?.collections?.map((c) => (
          <MovieRow key={c.collection} title={c.collection} titles={c.titles} />
        ))}
      </div>
    </div>
  );
}
