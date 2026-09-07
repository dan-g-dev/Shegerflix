import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { assetUrl } from "../api/assetUrl";

const FALLBACK_BACKDROP = 'https://placehold.co/1280x720/15151c/9a9aa5?text=ShegerFlix';
const AUTOPLAY_MS = 7000;

export default function Hero({ titles = [] }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % titles.length);
  }, [titles.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + titles.length) % titles.length);
  }, [titles.length]);

  useEffect(() => {
    if (titles.length < 2) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [titles.length, next, index]);

  if (!titles.length) return null;
  const title = titles[index];

  return (
    <section className="relative h-[46vh] min-h-[280px] sm:h-[56vh] sm:min-h-[360px] md:h-[68vh] md:min-h-[420px] w-full overflow-hidden group/hero">
      <img
        key={title.id}
        src={assetUrl(title.backdrop_url) || FALLBACK_BACKDROP}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_BACKDROP;
        }}
        alt={title.title}
        className="absolute inset-0 h-full w-full object-cover hero-fade-in"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-sheger-bg via-sheger-bg/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-sheger-bg/80 sm:from-sheger-bg/70 via-transparent to-transparent" />

      <div
        key={`content-${title.id}`}
        className="relative z-10 flex h-full max-w-7xl mx-auto flex-col justify-end px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 hero-fade-in"
      >
        <h1 className="max-w-xl text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-md">
          {title.title}
        </h1>
        <p className="mt-2 sm:mt-3 max-w-md sm:max-w-lg text-xs sm:text-sm md:text-base text-sheger-text/90 line-clamp-3">
          {title.description}
        </p>
        <div className="mt-4 sm:mt-5 flex gap-3">
          <Link
            to={`/title/${title.slug}`}
            className="rounded bg-sheger-text px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-semibold text-sheger-bg hover:bg-sheger-text/90 transition-transform hover:scale-105"
          >
            ▶ Play
          </Link>
          <Link
            to={`/title/${title.slug}`}
            className="rounded bg-white/20 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-semibold backdrop-blur hover:bg-white/30 transition-transform hover:scale-105"
          >
            More Info
          </Link>
        </div>
      </div>

      {titles.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-black/40 text-white flex items-center justify-center opacity-70 sm:opacity-0 sm:group-hover/hero:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-black/40 text-white flex items-center justify-center opacity-70 sm:opacity-0 sm:group-hover/hero:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronRight />
          </button>

          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {titles.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`hero-dot h-1.5 rounded-full ${i === index ? "w-6 bg-sheger-yellow" : "w-1.5 bg-white/40 hover:bg-white/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
