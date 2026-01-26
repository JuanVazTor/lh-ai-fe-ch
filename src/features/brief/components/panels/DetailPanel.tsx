import { STATUS_LABELS, formatSeverityLabel } from '../../lib/citations.ts';
import type { Citation, VerificationResult } from '../../../../types/index.ts';

interface DetailPanelProps {
  citation: Citation | null;
  result: VerificationResult | null;
}

export function DetailPanel({ citation, result }: DetailPanelProps): JSX.Element {
  if (!citation || !result) {
    return (
      <section className="panel detail-panel sticky-panel">
        <div className="panel-header">
          <div>
            <p className="panel-kicker">Verification</p>
            <h2 className="panel-title">Citation details</h2>
            <p className="panel-subtitle">Select a citation to inspect its status.</p>
          </div>
        </div>
        <div className="detail-empty">
          <p>Pick a citation flag inside the brief or from the review queue.</p>
          <p className="detail-footer">Tip: Use arrow keys to move between citations.</p>
        </div>
      </section>
    );
  }

  const severityLabel = formatSeverityLabel(result.severity);
  const statusLabel = STATUS_LABELS[result.status];
  const expectedQuote = result.details?.expectedQuote;
  const actualQuote = result.details?.actualQuote;
  const treatmentHistory = result.details?.treatmentHistory;

  return (
    <section className="panel detail-panel sticky-panel">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Verification</p>
          <h2 className="panel-title">Citation details</h2>
          <p className="panel-subtitle">{statusLabel}</p>
        </div>
        <span className="status-pill" data-severity={result.severity}>
          {severityLabel}
        </span>
      </div>

      <div className="detail-callout" data-severity={result.severity}>
        {result.message}
      </div>

      <div className="detail-block">
        <span className="detail-label">Citation</span>
        <span className="detail-value">{citation.text}</span>
      </div>

      <div className="detail-block">
        <span className="detail-label">Case name</span>
        <span className="detail-value">{citation.caseName}</span>
      </div>

      <div className="detail-block">
        <span className="detail-label">Reporter</span>
        <span className="detail-value">
          {citation.reporter}
          {citation.pinCite ? ` at ${citation.pinCite}` : ''} ({citation.year})
        </span>
      </div>

      <div className="detail-block">
        <span className="detail-label">Status</span>
        <span className="detail-value">{statusLabel}</span>
      </div>

      {(expectedQuote || actualQuote) && (
        <div className="detail-block">
          <span className="detail-label">Quote comparison</span>
          <div className="quote-grid">
            {expectedQuote && (
              <div className="quote-card">
                <p className="detail-label">Quote in brief</p>
                <p className="detail-value">{expectedQuote}</p>
              </div>
            )}
            {actualQuote && (
              <div className="quote-card">
                <p className="detail-label">Source quote</p>
                <p className="detail-value">{actualQuote}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {treatmentHistory && (
        <div className="detail-block">
          <span className="detail-label">Treatment history</span>
          <p className="detail-value">{treatmentHistory}</p>
        </div>
      )}
    </section>
  );
}
