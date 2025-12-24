import { useState, useEffect, useCallback } from 'react';
import { businessService } from '../services';

/**
 * Custom hook for fetching and managing businesses
 * @param {object} options - Options for fetching
 * @param {boolean} options.autoFetch - Auto fetch on mount
 * @returns {object} Business state and handlers
 */
export const useBusinesses = ({ autoFetch = true } = {}) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await businessService.getAll();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchBusinesses = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await businessService.search(params);
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchBusinesses();
    }
  }, [autoFetch, fetchBusinesses]);

  return {
    businesses,
    loading,
    error,
    fetchBusinesses,
    searchBusinesses,
    setBusinesses
  };
};

export default useBusinesses;

