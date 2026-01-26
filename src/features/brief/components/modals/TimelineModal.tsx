import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { formatSeverityLabel, STATUS_LABELS } from '../../lib/citations.ts';
import type { Brief, Severity, VerificationResult } from '../../../../types/index.ts';

interface TimelineItem {
  id: string;
  year: number;
  caseName: string;
  reporter: string;
  pinCite?: string;
  severity: Severity;
  statusLabel: string;
  message: string;
}

interface TimelineModalProps {
  brief: Brief;
  resultsById: Map<string, VerificationResult>;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_MESSAGE = 'Verification pending.';
const DEFAULT_SEVERITY: Severity = 'none';
const ESCAPE_KEY = 'Escape';
const PENDING_STATUS_LABEL = 'Pending';
const TIMELINE_TITLE_ID = 'timeline-title';
const TIMELINE_DESCRIPTION_ID = 'timeline-description';

function buildTimelineItems(
  brief: Brief,
  resultsById: Map<string, VerificationResult>
): TimelineItem[] {
  const items = brief.citations.map((citation) => {
    const result = resultsById.get(citation.id);
    const severity = result?.severity ?? DEFAULT_SEVERITY;
    const statusLabel = result ? STATUS_LABELS[result.status] : PENDING_STATUS_LABEL;
    const message = result?.message ?? DEFAULT_MESSAGE;

    return {
      id: citation.id,
      year: citation.year,
      caseName: citation.caseName,
      reporter: citation.reporter,
      pinCite: citation.pinCite,
      severity,
      statusLabel,
      message,
    };
  });

  return items.sort((left, right) => {
    const yearDifference = right.year - left.year;
    if (yearDifference !== 0) {
      return yearDifference;
    }
    return left.caseName.localeCompare(right.caseName);
  });
}

function formatReporterText(item: TimelineItem): string {
  if (item.pinCite) {
    return `${item.reporter} at ${item.pinCite}`;
  }
  return item.reporter;
}

export function TimelineModal({
  brief,
  resultsById,
  isOpen,
  onClose,
}: TimelineModalProps): JSX.Element | null {
  const items = useMemo(() => {
    return buildTimelineItems(brief, resultsById);
  }, [brief, resultsById]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === ESCAPE_KEY) {
        event.preventDefault();
        onClose();
      }
    }

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="timeline-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={TIMELINE_TITLE_ID}
      aria-describedby={TIMELINE_DESCRIPTION_ID}
    >
      <div className="timeline-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="timeline-panel" role="document">
        <div className="timeline-header">
          <div>
            <p className="panel-kicker">Citation timeline</p>
            <h2 className="panel-title" id={TIMELINE_TITLE_ID}>
              Verification history
            </h2>
            <p className="panel-subtitle" id={TIMELINE_DESCRIPTION_ID}>
              A chronological view of cited authorities and their verification status.
            </p>
          </div>
          <button type="button" className="ghost-button timeline-close" onClick={onClose}>
            <span className="ghost-button__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 6l-12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Close
          </button>
        </div>

        <ol className="timeline-list">
          {items.map((item) => (
            <li key={item.id} className="timeline-item">
              <span className="timeline-marker" data-severity={item.severity} aria-hidden="true" />
              <div className="timeline-content">
                <div className="timeline-row">
                  <span className="timeline-year">{item.year}</span>
                  <span className="timeline-case">{item.caseName}</span>
                </div>
                <div className="timeline-meta">
                  <span className="timeline-cite">{formatReporterText(item)}</span>
                  <span className="status-pill" data-severity={item.severity}>
                    {formatSeverityLabel(item.severity)}
                  </span>
                  <span className="timeline-status">{item.statusLabel}</span>
                </div>
                <p className="timeline-message">{item.message}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>,
    document.body
  );
}
