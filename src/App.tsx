import { useState } from 'react';
import { BriefViewer } from './components/BriefViewer';
import { DetailPanel } from './components/DetailPanel';
import { sampleBrief } from './data/sampleBrief';
import { Citation, VerificationResult } from './types';

function App() {
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [selectedResult, setSelectedResult] = useState<VerificationResult | null>(null);

  const handleCitationClick = (citation: Citation, result: VerificationResult) => {
    setSelectedCitation(citation);
    setSelectedResult(result);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <BriefViewer
            brief={sampleBrief}
            onCitationClick={handleCitationClick}
            selectedCitationId={selectedCitation?.id || null}
          />
        </div>
        <div>
          <DetailPanel citation={selectedCitation} result={selectedResult} />
        </div>
      </main>
    </div>
  );
}

export default App;
