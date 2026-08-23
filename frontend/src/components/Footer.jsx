export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5 bg-sheger-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-sheger-muted">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="font-bold text-sheger-text">
              <span className="text-sheger-red">Sheger</span>
              <span className="text-sheger-yellow">Flix</span>
            </p>
            <p className="mt-1 max-w-sm">Ethiopia's Home for Stories.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:flex sm:gap-8">
            <span>About</span>
            <span>Help Center</span>
            <span>Terms</span>
            <span>Privacy</span>
          </div>
        </div>
        <p className="mt-6 text-xs">© {new Date().getFullYear()} ShegerFlix — a portfolio project, not affiliated with any streaming service.</p>
      </div>
    </footer>
  );
}
