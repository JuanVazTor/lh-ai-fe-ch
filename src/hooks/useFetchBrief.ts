import { useState, useEffect } from 'react';
import { Brief } from '../types';
import { sampleBrief } from '../data/sampleBrief';

interface ApiResponse {
  success: boolean;
  data?: Brief;
  error?: string;
}

interface UseFetchBriefOptions {
  simulate?: 'success' | 'error' | 'random';
  maxRetries?: number;
}

export const useFetchBrief = (options: UseFetchBriefOptions = {}) => {
  // to simulate an error set the string "success" to "error"
  const { simulate = 'success', maxRetries = 2 } = options;

  const [brief, setBrief] = useState<Brief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const shouldFail =
          simulate === 'error' || (simulate === 'random' && Math.random() > 0.7);

        if (shouldFail) {
          throw new Error('Failed to fetch brief from server');
        }

        const response: ApiResponse = {
          success: true,
          data: sampleBrief,
        };

        if (response.success && response.data) {
          setBrief(response.data);
          setRetryAttempt(0);
        } else {
          throw new Error(response.error || 'Failed to fetch brief');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';

        if (retryAttempt < maxRetries) {
          console.warn(
            `API call failed (attempt ${retryAttempt + 1}/${maxRetries + 1}). Retrying in 1 second...`
          );
          setError(null);

          const retryTimer = setTimeout(() => {
            setRetryAttempt((prev) => prev + 1);
          }, 1000);

          return () => clearTimeout(retryTimer);
        }

        setError(
          `${errorMessage} (Attempts: ${retryAttempt + 1}/${maxRetries + 1})`
        );
        setBrief(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrief();
  }, [simulate, maxRetries, retryAttempt]);

  const retry = () => {
    setRetryAttempt(0);
    setBrief(null);
    setError(null);
  };

  return { brief, isLoading, error, retryAttempt, retry };
};
