import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-extrabold text-sheger-red">404</h1>
      <p className="mt-3 text-lg font-medium">This page doesn't exist.</p>
      <Link to="/" className="mt-5 rounded bg-sheger-red px-5 py-2.5 text-sm font-semibold">
        Back to Home
      </Link>
    </div>
  );
}
