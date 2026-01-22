import { useState, useEffect } from 'react';
import { Brief } from '../types';
import { sampleBrief } from '../data/sampleBrief';

interface ApiResponse {
  success: boolean;
  data?: Brief;
  error?: string;
}

export const useFetchBrief = () => {
  const [brief, setBrief] = useState<Brief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const response: ApiResponse = {
          success: true,
          data: sampleBrief,
        };

        if (response.success && response.data) {
          setBrief(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch brief');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setBrief(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrief();
  }, []);

  return { brief, isLoading, error };
};
