/**
 * context/ToastContext.jsx
 * ------------------------------------------------------------
 * Global toast notifications. Call useToast().show('message') from
 * anywhere in the app instead of local inline "toast" state per page.
 * Toasts auto-dismiss after a few seconds and slide in/out (see the
 * @keyframes in index.css and the Toast component below).
 * ------------------------------------------------------------
 */
import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'info') => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  function dismiss(id) {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={`toast-slide-in pointer-events-auto max-w-xs sm:max-w-sm rounded-lg px-4 py-3 text-sm font-medium shadow-xl cursor-pointer ${
              t.type === 'success'
                ? 'bg-sheger-green text-white'
                : t.type === 'error'
                ? 'bg-sheger-red text-white'
                : 'bg-sheger-card text-sheger-text border border-white/10'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
