import { Suspense, lazy, useCallback, useMemo, useState, useTransition } from 'react';
import { AppHeader } from './components/layout/AppHeader.tsx';
import { sampleBrief } from './data/sampleBrief.ts';
import { buildStats, type FilterValue } from './lib/citations.ts';
import { useCitationNavigation } from './hooks/useCitationNavigation.ts';
import { useVerificationCycle } from './hooks/useVerificationCycle.ts';
import type { VerificationResult } from '../../types/index.ts';

const SummaryGrid = lazy(() =>
  import('./components/panels/SummaryGrid.tsx').then((module) => ({
    default: module.SummaryGrid,
  }))
);

const CitationQueue = lazy(() =>
  import('./components/panels/CitationQueue.tsx').then((module) => ({
    default: module.CitationQueue,
  }))
);

const DocumentPanel = lazy(() =>
  import('./components/panels/DocumentPanel.tsx').then((module) => ({
    default: module.DocumentPanel,
  }))
);

const DetailPanel = lazy(() =>
  import('./components/panels/DetailPanel.tsx').then((module) => ({
    default: module.DetailPanel,
  }))
);

const DEFAULT_SKELETON_LINES = 3;
const SUMMARY_CARD_COUNT = 4;

export function BriefPage(): JSX.Element {
  const brief = sampleBrief;
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [selectedCitationId, setSelectedCitationId] = useState<string | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const { isVerifying, runVerification } = useVerificationCycle();
  const [, startTransition] = useTransition();

  const resultsById = useMemo(() => {
    return new Map<string, VerificationResult>(
      brief.verificationResults.map((result) => [result.citationId, result])
    );
  }, [brief.verificationResults]);

  const filteredCitations = useMemo(() => {
    if (activeFilter === 'all') {
      return brief.citations;
    }

    return brief.citations.filter((citation) => {
      const result = resultsById.get(citation.id);
      return result?.severity === activeFilter;
    });
  }, [activeFilter, brief.citations, resultsById]);

  const selectedCitation = useMemo(() => {
    if (!selectedCitationId) {
      return null;
    }

    return brief.citations.find((citation) => citation.id === selectedCitationId) ?? null;
  }, [brief.citations, selectedCitationId]);

  const selectedResult = useMemo(() => {
    if (!selectedCitationId) {
      return null;
    }

    return resultsById.get(selectedCitationId) ?? null;
  }, [resultsById, selectedCitationId]);

  const stats = useMemo(() => {
    return buildStats(brief.citations.length, brief.verificationResults);
  }, [brief.citations.length, brief.verificationResults]);

  useCitationNavigation({
    citations: filteredCitations,
    selectedCitationId,
    onSelect: setSelectedCitationId,
  });

  const handleCitationSelect = useCallback((citationId: string): void => {
    setSelectedCitationId(citationId);
  }, []);

  const handleFilterSelect = useCallback(
    (filter: FilterValue): void => {
      startTransition(() => {
        setActiveFilter(filter);
      });
    },
    [startTransition]
  );

  const handleRunVerification = useCallback((): void => {
    runVerification();
  }, [runVerification]);

  const handleToggleFocus = useCallback((): void => {
    startTransition(() => {
      setIsFocusMode((previous) => !previous);
    });
  }, [startTransition]);

  return (
    <div className="app-shell" data-focus={isFocusMode}>
      <AppHeader citationCount={brief.citations.length} />

      <Suspense fallback={<SummaryFallback />}>
        <SummaryGrid stats={stats} />
      </Suspense>

      <main className="app-grid fade-in">
        <Suspense fallback={<PanelFallback className="queue-panel" label="Loading queue" />}>
          <CitationQueue
            activeFilter={activeFilter}
            filteredCitations={filteredCitations}
            resultsById={resultsById}
            selectedCitationId={selectedCitationId}
            stats={stats}
            onFilterSelect={handleFilterSelect}
            onSelectCitation={handleCitationSelect}
          />
        </Suspense>

        <Suspense
          fallback={<PanelFallback className="document-panel" label="Loading brief" />}
        >
          <DocumentPanel
            brief={brief}
            resultsById={resultsById}
            selectedCitationId={selectedCitationId}
            isVerifying={isVerifying}
            isFocusMode={isFocusMode}
            onCitationSelect={handleCitationSelect}
            onToggleFocus={handleToggleFocus}
            onRunVerification={handleRunVerification}
          />
        </Suspense>

        <Suspense
          fallback={<PanelFallback className="detail-panel" label="Loading details" />}
        >
          <DetailPanel citation={selectedCitation} result={selectedResult} />
        </Suspense>
      </main>
    </div>
  );
}

function PanelFallback({ className, label }: { className?: string; label: string }): JSX.Element {
  return (
    <section className={`panel panel-skeleton ${className ?? ''}`} aria-busy="true">
      <p className="panel-kicker">{label}</p>
      <div className="skeleton-lines" aria-hidden="true">
        {Array.from({ length: DEFAULT_SKELETON_LINES }).map((_, index) => (
          <span key={`skeleton-${index}`} className="skeleton-line" />
        ))}
      </div>
    </section>
  );
}

function SummaryFallback(): JSX.Element {
  return (
    <section className="summary-grid fade-in" aria-busy="true">
      {Array.from({ length: SUMMARY_CARD_COUNT }).map((_, index) => (
        <div key={`metric-${index}`} className="metric-card panel-skeleton">
          <span className="metric-label">Loading</span>
          <span className="skeleton-line" />
        </div>
      ))}
    </section>
  );
}
