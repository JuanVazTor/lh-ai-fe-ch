import { Brief, Citation, VerificationResult } from '../types';

interface BriefViewerProps {
  brief: Brief;
  onCitationClick: (citation: Citation, result: VerificationResult) => void;
  selectedCitationId: string | null;
}

export function BriefViewer({
  brief,
  onCitationClick,
  selectedCitationId,
}: BriefViewerProps) {
  const getResultForCitation = (citationId: string): VerificationResult | undefined => {
    return brief.verificationResults.find((r) => r.citationId === citationId);
  };

  const renderContent = () => {
    const content = brief.content;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    const citationRegex = /\[\[CITATION:(\d+)\]\]/g;
    let match;

    while ((match = citationRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      const citationIndex = parseInt(match[1], 10) - 1;
      const citation = brief.citations[citationIndex];

      if (citation) {
        const result = getResultForCitation(citation.id);
        const severity = result?.severity || 'none';
        const isSelected = selectedCitationId === citation.id;

        parts.push(
            <button
              type="button"
              onClick={() => result && onCitationClick(citation, result)}
              className={`
                inline-flex items-center rounded-md px-1.5 py-0.5 text-sm font-medium
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-offset-1
                ${
                  severity === 'critical'
                    ? 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-400'
                    : severity === 'warning'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-400'
                    : 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-400'
                }
                ${isSelected ? 'ring-2 ring-slate-900 ring-offset-1' : ''}
              `}
            >
              {citation.text}
            </button>

        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="mb-4">
      <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{brief.title}</h1>
      <div className="whitespace-pre-wrap">{renderContent()}</div>
    </div>
  );
}
