import type { Brief, Severity, VerificationResult } from '../../../types/index.ts';
import { buildStats, formatSeverityLabel, STATUS_LABELS } from './citations.ts';

const DATE_PART_LENGTH = 10;
const DEFAULT_MESSAGE = 'Verification pending.';
const DEFAULT_SEVERITY: Severity = 'none';
const DISPLAY_INDEX_OFFSET = 1;
const EXPORT_EXTENSION = 'txt';
const EXPORT_FILE_PREFIX = 'trusted-hand-notes';
const EXPORT_MIME = 'text/plain;charset=utf-8';
const EXPORT_REVOKE_DELAY_MS = 1000;
const PENDING_STATUS_LABEL = 'Pending';

const CLEANUP_PATTERN = /[^a-z0-9]+/gi;
const TRIM_PATTERN = /^-+|-+$/g;

function sanitizeTitle(title: string): string {
  const trimmed = title.trim().toLowerCase();
  const replaced = trimmed.replace(CLEANUP_PATTERN, '-');
  return replaced.replace(TRIM_PATTERN, '');
}

function buildFileName(title: string, isoDate: string): string {
  const datePart = isoDate.slice(0, DATE_PART_LENGTH);
  const safeTitle = sanitizeTitle(title);
  const parts = [EXPORT_FILE_PREFIX, safeTitle, datePart].filter((part) => part.length > 0);
  return `${parts.join('-')}.${EXPORT_EXTENSION}`;
}

function buildNotes(brief: Brief, resultsById: Map<string, VerificationResult>): string {
  const timestamp = new Date().toISOString();
  const stats = buildStats(brief.citations.length, Array.from(resultsById.values()));
  const lines: string[] = [];

  lines.push('# Trusted Hand - Citation Review Notes');
  lines.push('');
  lines.push(`Brief: ${brief.title}`);
  lines.push(`Generated: ${timestamp}`);
  lines.push('');
  lines.push('## Summary');
  lines.push(`- Total citations: ${stats.total}`);
  lines.push(`- Verified: ${stats.verified}`);
  lines.push(`- Warnings: ${stats.warning}`);
  lines.push(`- Critical: ${stats.critical}`);
  lines.push('');
  lines.push('## Citations');

  brief.citations.forEach((citation, index) => {
    const result = resultsById.get(citation.id);
    const severity = result?.severity ?? DEFAULT_SEVERITY;
    const statusLabel = result ? STATUS_LABELS[result.status] : PENDING_STATUS_LABEL;
    const message = result?.message ?? DEFAULT_MESSAGE;

    lines.push('');
    lines.push(`### ${index + DISPLAY_INDEX_OFFSET}. ${citation.caseName} (${citation.year})`);
    lines.push(`Citation: ${citation.text}`);
    lines.push(`Status: ${statusLabel}`);
    lines.push(`Severity: ${formatSeverityLabel(severity)}`);
    lines.push(`Note: ${message}`);

    if (result?.details?.expectedQuote) {
      lines.push(`Expected quote: "${result.details.expectedQuote}"`);
    }

    if (result?.details?.actualQuote) {
      lines.push(`Actual quote: "${result.details.actualQuote}"`);
    }

    if (result?.details?.treatmentHistory) {
      lines.push(`Treatment history: ${result.details.treatmentHistory}`);
    }
  });

  return lines.join('\n');
}

export function downloadNotes(brief: Brief, resultsById: Map<string, VerificationResult>): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const timestamp = new Date().toISOString();
  const notes = buildNotes(brief, resultsById);
  const fileName = buildFileName(brief.title, timestamp);

  const blob = new Blob([notes], { type: EXPORT_MIME });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), EXPORT_REVOKE_DELAY_MS);
}
