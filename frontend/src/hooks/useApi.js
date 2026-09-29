import { useState, useEffect } from 'react';
import api from '../lib/api';

/**
 * Generic data fetching hook
 * @param {string} endpoint - API endpoint (e.g. '/public/company')
 * @param {object} [params] - Optional query params
 */
export function useApi(endpoint, params = null) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api.get(endpoint, params ? { params } : undefined)
      .then((res) => {
        if (!cancelled) setData(res.data?.data ?? res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Terjadi kesalahan');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, JSON.stringify(params)]);

  return { data, loading, error };
}

/* Specific hooks for public endpoints */
export const useCompany  = ()       => useApi('/public/company');
export const useCoreValues = ()     => useApi('/public/core-values');
export const useGallery  = (cat)    => useApi('/public/gallery', cat ? { category: cat } : null);
export const useJobs     = (params) => useApi('/public/jobs', params);
export const useJobById  = (id)     => useApi(`/public/jobs/${id}`);
export const useBenefits = ()       => useApi('/public/benefits');
export const usePrograms = ()       => useApi('/public/programs');
export const useFaqs     = ()       => useApi('/public/faqs');
export const useContact  = ()       => useApi('/public/contact');
export const useCategories = ()     => useApi('/public/job-categories');
export const useTradeDestinations = () => useApi('/public/trade-destinations');
