import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Brief, Citation, VerificationResult } from '../types';
import { CitationMarker } from './CitationMarker';

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

  const getResultForCitation = (
    citationId: string
  ): VerificationResult | undefined => {
    return brief.verificationResults.find(
      (r) => r.citationId === citationId
    );
  };

  return (
    <div className="mb-4">
      <h1 className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">
        {brief.title}
      </h1>

      <div className="prose prose-slate max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="mt-12 mb-4 text-2xl font-semibold text-slate-900 tracking-tight">
                {children}
              </h1>
            ),

            h2: ({ children }) => (
              <h2 className="mt-10 mb-3 text-xl font-semibold text-slate-900 tracking-tight">
                {children}
              </h2>
            ),

            h3: ({ children }) => (
              <h3 className="mt-8 mb-2 text-lg font-medium text-slate-800">
                {children}
              </h3>
            ),

            h4: ({ children }) => (
              <h4 className="mt-6 mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
                {children}
              </h4>
            ),

            p: ({ children }) => {
              const processNode = (node: React.ReactNode) => {
                if (typeof node !== 'string') {
                  return node;
                }

                const citationRegex = /\[\[CITATION:(\d+)\]\]/g;
                const parts: React.ReactNode[] = [];
                let lastIndex = 0;
                let match;

                while ((match = citationRegex.exec(node)) !== null) {
                  if (match.index > lastIndex) {
                    parts.push(node.slice(lastIndex, match.index));
                  }

                  const citationIndex = Number(match[1]) - 1;
                  const citation = brief.citations[citationIndex];

                  if (citation) {
                    const result = getResultForCitation(citation.id);
                    const isSelected =
                      selectedCitationId === citation.id;

                    parts.push(
                      <CitationMarker
                        key={`${citation.id}-${match.index}`}
                        citation={citation}
                        result={result}
                        isSelected={isSelected}
                        onClick={() =>
                          result && onCitationClick(citation, result)
                        }
                      />
                    );
                  }

                  lastIndex = match.index + match[0].length;
                }

                if (lastIndex < node.length) {
                  parts.push(node.slice(lastIndex));
                }

                return parts;
              };

              return (
                <p>
                  {Array.isArray(children)
                    ? children.map((child, index) => (
                        <React.Fragment key={index}>
                          {processNode(child)}
                        </React.Fragment>
                      ))
                    : processNode(children)}
                </p>
              );
            },
          }}
        >
          {brief.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
