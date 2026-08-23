/**
 * components/PageTransition.jsx
 * ------------------------------------------------------------
 * Wraps <Routes> children so every page fades+slides in on
 * navigation instead of popping in instantly. Keyed by pathname
 * so React remounts (and re-triggers the animation) on every
 * route change.
 * ------------------------------------------------------------
 */
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-fade-in">
      {children}
    </div>
  );
}
