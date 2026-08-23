/**
 * context/MyListContext.jsx
 * ------------------------------------------------------------
 * Holds the logged-in user's My List as a Set of title ids so any
 * MovieCard/TitleDetails can show the correct heart state and
 * toggle it, without every component fetching /mylist separately.
 * ------------------------------------------------------------
 */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const MyListContext = createContext(null);

export function MyListProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [ids, setIds] = useState(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      setIds(new Set());
      return;
    }
    api
      .get('/mylist')
      .then(({ data }) => setIds(new Set(data.titles.map((t) => t.id))))
      .catch(() => {});
  }, [isAuthenticated]);

  const toggle = useCallback(async (titleId) => {
    const wasInList = ids.has(titleId);
    // optimistic update so the heart animates instantly, then reconcile with the server
    setIds((prev) => {
      const next = new Set(prev);
      wasInList ? next.delete(titleId) : next.add(titleId);
      return next;
    });
    try {
      if (wasInList) {
        await api.delete(`/mylist/${titleId}`);
      } else {
        await api.post('/mylist', { titleId });
      }
      return !wasInList; // new "in list" state
    } catch (err) {
      // revert on failure
      setIds((prev) => {
        const next = new Set(prev);
        wasInList ? next.add(titleId) : next.delete(titleId);
        return next;
      });
      throw err;
    }
  }, [ids]);

  return (
    <MyListContext.Provider value={{ ids, isSaved: (id) => ids.has(id), toggle }}>
      {children}
    </MyListContext.Provider>
  );
}

export function useMyList() {
  const ctx = useContext(MyListContext);
  if (!ctx) throw new Error('useMyList must be used within a MyListProvider');
  return ctx;
}
