import { useState } from 'react';
import { BriefViewer } from './components/BriefViewer';
import { BriefSkeleton } from './components/skeletons/BriefSkeleton';
import { DetailPanel } from './components/DetailPanel';
import { DetailPanelSkeleton } from './components/skeletons/DetailPanelSkeleton';
import { Header } from './components/Header';
import { useFetchBrief } from './hooks/useFetchBrief';
import { Citation, VerificationResult } from './types';

function App() {
  const { brief, isLoading, error, retry } = useFetchBrief();
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [selectedResult, setSelectedResult] = useState<VerificationResult | null>(null);

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

  const handleMenuClick = () => {
    console.log('Menu clicked');
  };

  const handleShareClick = () => {
    console.log('Share clicked');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header onMenuClick={handleMenuClick} onShareClick={handleShareClick} />
      
      <div className="flex-1 flex">
        {selectedCitation && (
          <div
            onClick={clearSelection}
            className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          />
        )}

      <aside
        className={`fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white shadow-2xl z-50 transition-transform duration-300 overflow-y-auto ${
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

      <main className="flex-1 w-full flex justify-center py-10">
        <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            {isLoading ? (
              <BriefSkeleton />
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 font-medium">Error: {error}</p>
                <button
                  onClick={retry}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : brief ? (
              <BriefViewer
                brief={brief}
                onCitationClick={handleCitationClick}
                selectedCitationId={selectedCitation?.id || null}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600">No brief data available</p>
              </div>
            )}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

export default App;

