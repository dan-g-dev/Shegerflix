import { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';

export default function MovieRow({ title, titles }) {
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateArrows() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titles]);

  function scrollByAmount(direction) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85 * direction;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }

  if (!titles || titles.length === 0) return null;

  return (
    <section className="mb-8 group/row relative">
      <h2 className="mb-2.5 px-4 sm:px-6 lg:px-8 text-base sm:text-lg font-semibold text-sheger-text">
        {title}
      </h2>

      <div className="relative">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scrollByAmount(-1)}
            aria-label="Scroll left"
            className="hidden sm:flex absolute left-0 top-0 bottom-6 z-20 w-10 items-center justify-center bg-gradient-to-r from-sheger-bg via-sheger-bg/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <span className="h-9 w-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80">
              <ChevronLeft />
            </span>
          </button>
        )}

        <div
          ref={scrollerRef}
          className="scroll-row flex gap-3 overflow-x-auto overflow-y-visible px-4 sm:px-6 lg:px-8 py-6 -my-6"
        >
          {titles.map((t) => (
            <div key={t.id} className="shrink-0 w-32 sm:w-40 md:w-44 lg:w-48">
              <MovieCard title={t} />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scrollByAmount(1)}
            aria-label="Scroll right"
            className="hidden sm:flex absolute right-0 top-0 bottom-6 z-20 w-10 items-center justify-center bg-gradient-to-l from-sheger-bg via-sheger-bg/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <span className="h-9 w-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80">
              <ChevronRight />
            </span>
          </button>
        )}
      </div>
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
