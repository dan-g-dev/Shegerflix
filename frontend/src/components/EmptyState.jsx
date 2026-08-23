export default function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <p className="text-lg font-semibold text-sheger-text">{title}</p>
      {message && <p className="mt-1.5 max-w-sm text-sm text-sheger-muted">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
