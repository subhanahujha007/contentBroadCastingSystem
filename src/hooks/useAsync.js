import { useCallback, useEffect, useState } from 'react';

export function useAsync(asyncFn, options = {}) {
  const [data, setData] = useState(options.initialData ?? null);
  const [loading, setLoading] = useState(Boolean(options.immediate ?? true));
  const [error, setError] = useState('');

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError('');
    try {
      const response = await asyncFn(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err?.message || 'Request failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  useEffect(() => {
    if (options.immediate === false) return;
    execute().catch(() => {});
  }, [execute, options.immediate]);

  return { data, setData, loading, error, execute };
}
