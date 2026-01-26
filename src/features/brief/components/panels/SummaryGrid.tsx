import type { Stats } from '../../lib/citations.ts';

interface SummaryGridProps {
  stats: Stats;
}

export function SummaryGrid({ stats }: SummaryGridProps): JSX.Element {
  return (
    <section className="summary-grid fade-in">
      <div className="metric-card">
        <span className="metric-label">Total Citations</span>
        <span className="metric-value">{stats.total}</span>
      </div>
      <div className="metric-card">
        <span className="metric-label">Verified</span>
        <span className="metric-value" data-tone="valid">
          {stats.verified}
        </span>
      </div>
      <div className="metric-card">
        <span className="metric-label">Warnings</span>
        <span className="metric-value" data-tone="warning">
          {stats.warning}
        </span>
      </div>
      <div className="metric-card">
        <span className="metric-label">Critical</span>
        <span className="metric-value" data-tone="critical">
          {stats.critical}
        </span>
      </div>
    </section>
  );
}
