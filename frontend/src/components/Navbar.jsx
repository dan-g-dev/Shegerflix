import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/movies', label: 'Movies' },
  { to: '/series', label: 'Series' },
  { to: '/genres', label: 'Genres' },
  { to: '/my-list', label: 'My List' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  const linkClass = ({ isActive }) =>
    `text-base font-nav font-semibold transition-colors ${isActive ? 'text-sheger-yellow' : 'text-sheger-text/80 hover:text-sheger-text'}`;

  return (
    <header className="sticky top-0 z-40 bg-sheger-bg/95 backdrop-blur border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 shrink-0" onClick={() => setOpen(false)}>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-sheger-red">Sheger</span>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-sheger-yellow">Flix</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/search" aria-label="Search" className="text-sheger-text/80 hover:text-sheger-text">
              <SearchIcon />
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link to="/admin" className="text-base font-nav font-semibold text-sheger-green hover:text-sheger-green/80">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 group">
                  <span className="h-8 w-8 rounded bg-sheger-green flex items-center justify-center text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </Link>
                <button onClick={handleLogout} className="text-base font-nav font-semibold text-sheger-text/70 hover:text-sheger-text">
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded bg-sheger-red px-4 py-1.5 text-base font-nav font-semibold hover:bg-sheger-red/90"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -mr-2 text-sheger-text"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-sheger-surface">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-2.5 text-lg font-nav font-semibold border-b border-white/5 ${isActive ? 'text-sheger-yellow' : 'text-sheger-text/85'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/search" onClick={() => setOpen(false)} className="py-2.5 text-lg font-nav font-semibold text-sheger-text/85 border-b border-white/5">
              Search
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="py-2.5 text-lg font-nav font-semibold text-sheger-text/85 border-b border-white/5">
                  Profile ({user?.name})
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="py-2.5 text-lg font-nav font-semibold text-sheger-green border-b border-white/5">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="text-left py-3 text-lg font-nav font-semibold text-sheger-red">
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-2 rounded bg-sheger-red text-center py-2.5 text-lg font-nav font-semibold"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}
