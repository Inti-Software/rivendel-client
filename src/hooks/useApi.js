import { useState, useCallback } from 'react';

export function useApi(repositoryMethod) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await repositoryMethod(args);      
      if (!result.ok) {
        setError(result.error);
        return result;
      }
      setData(result.data || result);
      return result;
    } catch {
      const msg = "Ocurrió un error inesperado";
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [repositoryMethod]);

  return { data, loading, error, execute };
}