import { memo, useCallback, useMemo } from 'react';
import { FILTER_OPTIONS, formatSeverityLabel } from '../../lib/citations.ts';
import type { FilterValue, Stats } from '../../lib/citations.ts';
import type { Citation, Severity, VerificationResult } from '../../../../types/index.ts';

interface CitationQueueProps {
  activeFilter: FilterValue;
  filteredCitations: Citation[];
  resultsById: Map<string, VerificationResult>;
  selectedCitationId: string | null;
  stats: Stats;
  onFilterSelect: (filter: FilterValue) => void;
  onSelectCitation: (citationId: string) => void;
}

export function CitationQueue({
  activeFilter,
  filteredCitations,
  resultsById,
  selectedCitationId,
  stats,
  onFilterSelect,
  onSelectCitation,
}: CitationQueueProps): JSX.Element {
  const filterCounts = useMemo<Record<FilterValue, number>>(() => {
    return {
      all: stats.total,
      critical: stats.critical,
      warning: stats.warning,
      none: stats.verified,
    };
  }, [stats.critical, stats.total, stats.verified, stats.warning]);

  const handleSelectCitation = useCallback(
    (citationId: string): void => {
      onSelectCitation(citationId);
    },
    [onSelectCitation]
  );

  return (
    <section className="panel sticky-panel queue-panel">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Citation Queue</p>
          <h2 className="panel-title">Review items</h2>
          <p className="panel-subtitle">Select a citation to inspect its history.</p>
        </div>
      </div>

      <div className="filter-row">
        {FILTER_OPTIONS.map((option) => {
          const count = filterCounts[option.value];
          const isDisabled = count === 0;
          return (
            <button
              key={option.value}
              type="button"
              className="filter-chip"
              data-active={option.value === activeFilter}
              disabled={isDisabled}
              onClick={() => onFilterSelect(option.value)}
            >
              <span className="filter-chip__label">{option.label}</span>
              <span className="filter-chip__count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="citation-list">
        {filteredCitations.length === 0 ? (
          <div className="empty-state">No citations match this filter.</div>
        ) : (
          filteredCitations.map((citation) => {
            const result = resultsById.get(citation.id);
            const severity = result?.severity ?? 'none';

            return (
              <CitationQueueItem
                key={citation.id}
                citation={citation}
                severity={severity}
                isSelected={citation.id === selectedCitationId}
                onSelect={handleSelectCitation}
              />
            );
          })
        )}
      </div>
    </section>
  );
}

interface CitationQueueItemProps {
  citation: Citation;
  severity: Severity;
  isSelected: boolean;
  onSelect: (citationId: string) => void;
}

const CitationQueueItem = memo(function CitationQueueItem({
  citation,
  severity,
  isSelected,
  onSelect,
}: CitationQueueItemProps): JSX.Element {
  const handleClick = useCallback(() => {
    onSelect(citation.id);
  }, [citation.id, onSelect]);

  return (
    <button
      type="button"
      className="citation-item"
      data-selected={isSelected}
      onClick={handleClick}
    >
      <div>
        <p className="citation-name">{citation.caseName}</p>
        <p className="citation-meta">
          {citation.reporter}
          {citation.pinCite ? ` at ${citation.pinCite}` : ''} ({citation.year})
        </p>
      </div>
      <span className="status-pill" data-severity={severity}>
        {formatSeverityLabel(severity)}
      </span>
    </button>
  );
});
