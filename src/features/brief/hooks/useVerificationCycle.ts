import { useEffect, useState } from 'react';

const DEFAULT_VERIFY_DELAY_MS = 650;

export function useVerificationCycle(
  delayMs: number = DEFAULT_VERIFY_DELAY_MS
): {
  isVerifying: boolean;
  runVerification: () => void;
} {
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!isVerifying) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsVerifying(false);
    }, delayMs);

    return () => window.clearTimeout(timeout);
  }, [delayMs, isVerifying]);

  function runVerification(): void {
    if (isVerifying) {
      return;
    }

    setIsVerifying(true);
  }

  return { isVerifying, runVerification };
}
