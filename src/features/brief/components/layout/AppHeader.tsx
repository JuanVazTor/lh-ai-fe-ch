interface AppHeaderProps {
  citationCount: number;
}

export function AppHeader({ citationCount }: AppHeaderProps): JSX.Element {
  return (
    <header className="app-header fade-in">
      <div className="brand">
        <span className="brand-title">Trusted Hand</span>
        <span className="brand-name">Citation Review</span>
      </div>
      <div className="header-meta">
        <span className="meta-pill">Motion to Dismiss</span>
        <span className="meta-pill">{citationCount} citations</span>
        <span className="meta-pill">Review mode</span>
      </div>
    </header>
  );
}
