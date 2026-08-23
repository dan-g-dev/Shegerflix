export default function LoadingSpinner({ full = false }) {
  return (
    <div className={`flex items-center justify-center ${full ? 'h-[60vh]' : 'py-10'}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-sheger-muted border-t-sheger-red" />
    </div>
  );
}
