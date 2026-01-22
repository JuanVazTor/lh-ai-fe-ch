import { Citation, VerificationResult } from '../types';

interface CitationMarkerProps {
  citation: Citation;
  result?: VerificationResult;
  isSelected: boolean;
  onClick: () => void;
}

export function CitationMarker({
  citation,
  result,
  isSelected,
  onClick,
}: CitationMarkerProps) {
  const severity = result?.severity ?? 'none';

  const stylesBySeverity = {
    critical: {
      base: 'bg-red-100 text-red-800 hover:bg-red-200',
      border: 'border-red-400',
    },
    warning: {
      base: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      border: 'border-yellow-400',
    },
    none: {
      base: 'bg-green-100 text-green-800 hover:bg-green-200',
      border: 'border-green-400',
    },
  };

  const { base, border } = stylesBySeverity[severity];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center rounded-md
        px-1.5 py-0.5 text-sm font-medium
        transition-colors duration-150
        focus:outline-none
        ${base}
        ${isSelected ? `border-2 ${border}` : 'border'}
      `}
    >
      {citation.text}
    </button>
  );

}
