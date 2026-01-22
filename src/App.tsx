import { useState, useEffect } from 'react';
import { BriefViewer } from './components/BriefViewer';
import { BriefSkeleton } from './components/skeletons/BriefSkeleton';
import { DetailPanel } from './components/DetailPanel';
import { DetailPanelSkeleton } from './components/skeletons/DetailPanelSkeleton';
import { sampleBrief } from './data/sampleBrief';
import { Citation, VerificationResult } from './types';

function App() {
  const [isLoadingBrief, setIsLoadingBrief] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [selectedResult, setSelectedResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingBrief(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCitationClick = (citation: Citation, result: VerificationResult) => {
    setIsLoadingDetail(true);
    setSelectedCitation(citation);
    setSelectedResult(result);
    
    setTimeout(() => setIsLoadingDetail(false), 800);
  };

  const clearSelection = () => {
    setSelectedCitation(null);
    setSelectedResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {selectedCitation && (
        <div
          onClick={clearSelection}
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl z-50 transition-transform duration-300 overflow-y-auto ${
          selectedCitation ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <button
            onClick={clearSelection}
            className="absolute right-4 top-4 text-slate-500 hover:text-slate-700"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {isLoadingDetail ? (
            <DetailPanelSkeleton />
          ) : (
            <DetailPanel
              citation={selectedCitation}
              result={selectedResult}
              onClearSelection={clearSelection}
            />
          )}
        </div>
      </aside>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {isLoadingBrief ? <BriefSkeleton /> : (
            <BriefViewer
              brief={sampleBrief}
              onCitationClick={handleCitationClick}
              selectedCitationId={selectedCitation?.id || null}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

