import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
}

/**
 * @param apiFunction - La fonction API à exécuter
 * @returns État et fonctions pour gérer l'appel API
 */
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Une erreur est survenue';
        setState({ data: null, loading: false, error: errorMessage });
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}


export function useCrud<T extends { id: number }>(
  fetchAll: () => Promise<T[]>,
  createFn?: (item: Omit<T, 'id'>) => Promise<T>,
  updateFn?: (id: number, item: Partial<T>) => Promise<T>,
  deleteFn?: (id: number) => Promise<void>
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAll();
      setItems(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);

  const createItem = useCallback(
    async (item: Omit<T, 'id'>): Promise<T | null> => {
      if (!createFn) return null;
      setLoading(true);
      try {
        const newItem = await createFn(item);
        setItems((prev) => [...prev, newItem]);
        return newItem;
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [createFn]
  );

  const updateItem = useCallback(
    async (id: number, updates: Partial<T>): Promise<T | null> => {
      if (!updateFn) return null;
      setLoading(true);
      try {
        const updated = await updateFn(id, updates);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? updated : item))
        );
        return updated;
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [updateFn]
  );

  const deleteItem = useCallback(
    async (id: number): Promise<boolean> => {
      if (!deleteFn) return false;
      setLoading(true);
      try {
        await deleteFn(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
        return true;
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [deleteFn]
  );

  return {
    items,
    loading,
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
    setItems,
    setError,
  };
}