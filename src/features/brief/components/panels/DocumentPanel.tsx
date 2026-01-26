import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { BriefViewer } from '../BriefViewer.tsx';
import { TimelineModal } from '../modals/TimelineModal.tsx';
import { downloadNotes } from '../../lib/export.ts';
import type { Brief, VerificationResult } from '../../../../types/index.ts';

interface DocumentPanelProps {
  brief: Brief;
  resultsById: Map<string, VerificationResult>;
  selectedCitationId: string | null;
  isVerifying: boolean;
  isFocusMode: boolean;
  onCitationSelect: (citationId: string) => void;
  onToggleFocus: () => void;
  onRunVerification: () => void;
}

const EXPORT_FEEDBACK_MS = 1600;
const VERIFY_SUCCESS_MS = 1800;
const TOAST_LOADING_DURATION = Number.POSITIVE_INFINITY;
const EXPORT_SUCCESS_LABEL = 'Exported';
const EXPORT_IDLE_LABEL = 'Export Notes';
const EXPORT_TOAST_MESSAGE = 'Notes exported.';
const VERIFY_LOADING_MESSAGE = 'Running verification…';
const VERIFY_SUCCESS_MESSAGE = 'Verification updated.';

export function DocumentPanel({
  brief,
  resultsById,
  selectedCitationId,
  isVerifying,
  isFocusMode,
  onCitationSelect,
  onToggleFocus,
  onRunVerification,
}: DocumentPanelProps): JSX.Element {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [exportState, setExportState] = useState<'idle' | 'success'>('idle');
  const exportTimeoutRef = useRef<number | null>(null);
  const verifyToastIdRef = useRef<number | string | null>(null);
  const previousVerifyingRef = useRef(isVerifying);

  useEffect(() => {
    return () => {
      if (exportTimeoutRef.current) {
        window.clearTimeout(exportTimeoutRef.current);
      }
      if (verifyToastIdRef.current) {
        toast.dismiss(verifyToastIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const wasVerifying = previousVerifyingRef.current;
    if (!wasVerifying && isVerifying) {
      verifyToastIdRef.current = toast.loading(VERIFY_LOADING_MESSAGE, {
        duration: TOAST_LOADING_DURATION,
      });
    }

    if (wasVerifying && !isVerifying) {
      if (verifyToastIdRef.current) {
        toast.success(VERIFY_SUCCESS_MESSAGE, {
          id: verifyToastIdRef.current,
          duration: VERIFY_SUCCESS_MS,
        });
      } else {
        toast.success(VERIFY_SUCCESS_MESSAGE, { duration: VERIFY_SUCCESS_MS });
      }
      verifyToastIdRef.current = null;
    }

    previousVerifyingRef.current = isVerifying;
  }, [isVerifying]);

  function handleExportNotes(): void {
    downloadNotes(brief, resultsById);
    setExportState('success');
    toast.success(EXPORT_TOAST_MESSAGE, { duration: EXPORT_FEEDBACK_MS });
    if (exportTimeoutRef.current) {
      window.clearTimeout(exportTimeoutRef.current);
    }
    exportTimeoutRef.current = window.setTimeout(() => {
      setExportState('idle');
    }, EXPORT_FEEDBACK_MS);
  }

  function handleOpenTimeline(): void {
    setIsTimelineOpen(true);
  }

  function handleCloseTimeline(): void {
    setIsTimelineOpen(false);
  }

  return (
    <React.Fragment>
      <section className="panel document-panel" aria-busy={isVerifying}>
        <div className="panel-header">
          <div>
            <p className="panel-kicker">Annotated Brief</p>
            <h2 className="panel-title">{brief.title}</h2>
            <p className="panel-subtitle">Defendant: TechCorp Industries</p>
          </div>
          <div className="panel-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={onRunVerification}
              disabled={isVerifying}
            >
              <span className="ghost-button__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path
                    d="M20 12a8 8 0 1 1-2.35-5.65"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 4v6h-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {isVerifying ? 'Verifying…' : 'Re-run Verification'}
            </button>
            <button
              type="button"
              className="ghost-button"
              aria-pressed={isFocusMode}
              onClick={onToggleFocus}
            >
              <span className="ghost-button__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="3.5" />
                  <path
                    d="M20 12a8 8 0 1 1-16 0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {isFocusMode ? 'Exit Focus' : 'Focus Mode'}
            </button>
            <button
              type="button"
              className="ghost-button"
              data-state={exportState}
              onClick={handleExportNotes}
            >
              <span className="ghost-button__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path
                    d="M12 3v12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m7 8 5-5 5 5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 15v4h16v-4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {exportState === 'success' ? EXPORT_SUCCESS_LABEL : EXPORT_IDLE_LABEL}
            </button>
            <button
              type="button"
              className="ghost-button"
              aria-haspopup="dialog"
              aria-expanded={isTimelineOpen}
              onClick={handleOpenTimeline}
            >
              <span className="ghost-button__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="7" />
                  <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              View Timeline
            </button>
          </div>
        </div>

        <BriefViewer
          brief={brief}
          resultsById={resultsById}
          onCitationClick={onCitationSelect}
          selectedCitationId={selectedCitationId}
        />
      </section>
      <TimelineModal
        brief={brief}
        resultsById={resultsById}
        isOpen={isTimelineOpen}
        onClose={handleCloseTimeline}
      />
    </React.Fragment>
  );
}
