import { useEffect, useRef } from 'react';
import { Citation, VerificationResult } from '../types';

interface DetailPanelProps {
  citation: Citation | null;
  result: VerificationResult | null;
  onClearSelection: () => void;
}

export function DetailPanel({ citation, result, onClearSelection }: DetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClearSelection();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClearSelection]);
  if (!citation || !result) {
    return (
      <div ref={panelRef}>
        <p>Click on a citation to see verification details.</p>
      </div>
    );
  }

  return (
    <div ref={panelRef}>
      <h2 className="text-base font-semibold text-slate-900 tracking-tight mb-4">Citation Details</h2>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Citation:</h3>
        <p className="text-sm">{citation.text}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Case Name:</h3>
        <p className="text-sm">{citation.caseName}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Reporter:</h3>
        <p className="text-sm">{citation.reporter}</p>
      </div>

      {citation.pinCite && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Pin Cite:</h3>
          <p className="text-sm">{citation.pinCite}</p>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Year:</h3>
        <p className="text-sm">{citation.year}</p>
      </div>

      <hr className='mb-4' />

      <h2 className="text-base font-semibold text-slate-900 tracking-tight mb-4">Verification Result</h2>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Status:</h3>
        <p className="text-sm">{result.status}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Severity:</h3>
        <p className="text-sm">{result.severity}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Message:</h3>
        <p className="text-sm">{result.message}</p>
      </div>

      {result.details?.expectedQuote && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Quote in Brief:</h3>
          <p className="text-sm">{result.details.expectedQuote}</p>
        </div>
      )}

      {result.details?.actualQuote && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Actual Quote from Source:</h3>
          <p className="text-sm">{result.details.actualQuote}</p>
        </div>
      )}

      {result.details?.treatmentHistory && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Treatment History:</h3>
          <p className="text-sm">{result.details.treatmentHistory}</p>
        </div>
      )}
    </div>
  );
}
