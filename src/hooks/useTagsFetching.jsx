import { useState, useEffect } from 'react';
import queries from '../serverQueries';

function useTagsFetching() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await queries.getTagsDtoTree();

        setResults(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return {
    error,
    loading,
    results,
  };
}

export default useTagsFetching;
