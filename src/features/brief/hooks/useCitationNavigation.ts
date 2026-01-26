import { useEffect, useMemo } from 'react';
import { getNextIndex } from '../lib/citations.ts';
import type { Citation } from '../../../types/index.ts';

interface UseCitationNavigationProps {
  citations: Citation[];
  selectedCitationId: string | null;
  onSelect: (citationId: string | null) => void;
}

const KEY_PREVIOUS = 'ArrowUp';
const KEY_NEXT = 'ArrowDown';
const KEY_CLEAR = 'Escape';
const NAVIGATION_PREVIOUS = -1;
const NAVIGATION_NEXT = 1;
const NO_INDEX = -1;

export function useCitationNavigation({
  citations,
  selectedCitationId,
  onSelect,
}: UseCitationNavigationProps): void {
  const selectedIndex = useMemo(() => {
    if (!selectedCitationId) {
      return NO_INDEX;
    }

    return citations.findIndex((citation) => citation.id === selectedCitationId);
  }, [citations, selectedCitationId]);

  useEffect(() => {
    if (!selectedCitationId) {
      return;
    }

    const isVisible = citations.some((citation) => citation.id === selectedCitationId);

    if (!isVisible) {
      onSelect(null);
    }
  }, [citations, onSelect, selectedCitationId]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === KEY_CLEAR) {
        onSelect(null);
        return;
      }

      if (event.key !== KEY_NEXT && event.key !== KEY_PREVIOUS) {
        return;
      }

      event.preventDefault();

      const direction = event.key === KEY_NEXT ? NAVIGATION_NEXT : NAVIGATION_PREVIOUS;
      const nextIndex = getNextIndex(selectedIndex, direction, citations.length);

      if (nextIndex === NO_INDEX) {
        return;
      }

      const nextCitation = citations[nextIndex];

      if (nextCitation) {
        onSelect(nextCitation.id);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [citations, onSelect, selectedIndex]);
}
