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

    const colorClasses =
      severity === 'critical'
      ? 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-400'
      : severity === 'warning'
      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-400'
      : 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-400';

    return (
        <button
        type="button"
        onClick={onClick}
        className={`
            inline-flex items-center rounded-md
            px-1.5 py-0.5 text-sm font-medium
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${colorClasses}
            ${isSelected ? 'ring-2 ring-slate-900 ring-offset-1' : ''}
        `}
        >
        {citation.text}
        </button>
    );
}

