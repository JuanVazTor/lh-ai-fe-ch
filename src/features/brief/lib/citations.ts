import type { Severity, VerificationResult, VerificationStatus } from '../../../types/index.ts';

export type FilterValue = Severity | 'all';

export interface FilterOption {
  label: string;
  value: FilterValue;
}

export interface Stats {
  total: number;
  verified: number;
  warning: number;
  critical: number;
}

const NO_INDEX = -1;
const FIRST_INDEX = 0;

export const FILTER_OPTIONS: FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'Warning', value: 'warning' },
  { label: 'Verified', value: 'none' },
];

export const STATUS_LABELS: Record<VerificationStatus, string> = {
  valid: 'Valid',
  not_found: 'Not found',
  quote_mismatch: 'Quote mismatch',
  overruled: 'Overruled',
  superseded: 'Superseded',
};

export function buildStats(total: number, results: VerificationResult[]): Stats {
  const critical = results.filter((result) => result.severity === 'critical').length;
  const warning = results.filter((result) => result.severity === 'warning').length;
  const verified = results.filter((result) => result.severity === 'none').length;

  return {
    total,
    verified,
    warning,
    critical,
  };
}

export function formatSeverityLabel(severity: Severity): string {
  switch (severity) {
    case 'critical':
      return 'Critical';
    case 'warning':
      return 'Warning';
    case 'none':
      return 'Verified';
    default:
      return 'Reviewed';
  }
}

export function getNextIndex(currentIndex: number, direction: number, total: number): number {
  if (total === 0) {
    return NO_INDEX;
  }

  const firstIndex = FIRST_INDEX;
  const lastIndex = total - 1;

  if (currentIndex === NO_INDEX) {
    return direction > 0 ? firstIndex : lastIndex;
  }

  const nextIndex = currentIndex + direction;

  if (nextIndex < firstIndex) {
    return lastIndex;
  }

  if (nextIndex > lastIndex) {
    return firstIndex;
  }

  return nextIndex;
}
