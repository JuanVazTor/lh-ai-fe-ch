import {
  Children,
  cloneElement,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactMarkdown from 'react-markdown';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import type { Brief, Citation, Severity, VerificationResult } from '../../../types/index.ts';

interface BriefViewerProps {
  brief: Brief;
  resultsById: Map<string, VerificationResult>;
  onCitationClick: (citationId: string) => void;
  selectedCitationId: string | null;
}

interface RenderContext {
  brief: Brief;
  resultsById: Map<string, VerificationResult>;
  onCitationClick: (citationId: string) => void;
  selectedCitationId: string | null;
  flashCitationId: string | null;
}

const CITATION_INDEX_OFFSET = 1;
const CITATION_PATTERN = /\[\[CITATION:(\d+)\]\]/g;
const FLASH_DURATION_MS = 1400;
const FLASH_DEBOUNCE_MS = 180;

type MarkdownComponentProps<Tag extends keyof JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<Tag> & { node?: unknown };

export function BriefViewer({
  brief,
  resultsById,
  onCitationClick,
  selectedCitationId,
}: BriefViewerProps): JSX.Element {
  const [flashCitationId, setFlashCitationId] = useState<string | null>(null);
  const previousSelectedRef = useRef<string | null>(null);
  const flashStartTimeoutRef = useRef<number | null>(null);
  const flashEndTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!selectedCitationId) {
      if (flashStartTimeoutRef.current) {
        window.clearTimeout(flashStartTimeoutRef.current);
      }
      if (flashEndTimeoutRef.current) {
        window.clearTimeout(flashEndTimeoutRef.current);
      }
      setFlashCitationId(null);
      previousSelectedRef.current = null;
      return;
    }

    if (selectedCitationId === previousSelectedRef.current) {
      previousSelectedRef.current = selectedCitationId;
      return;
    }

    if (flashStartTimeoutRef.current) {
      window.clearTimeout(flashStartTimeoutRef.current);
    }
    if (flashEndTimeoutRef.current) {
      window.clearTimeout(flashEndTimeoutRef.current);
    }
    setFlashCitationId(null);
    flashStartTimeoutRef.current = window.setTimeout(() => {
      setFlashCitationId(selectedCitationId);
      flashEndTimeoutRef.current = window.setTimeout(() => {
        setFlashCitationId(null);
      }, FLASH_DURATION_MS);
    }, FLASH_DEBOUNCE_MS);
    previousSelectedRef.current = selectedCitationId;
  }, [selectedCitationId]);

  useEffect(() => {
    return () => {
      if (flashStartTimeoutRef.current) {
        window.clearTimeout(flashStartTimeoutRef.current);
      }
      if (flashEndTimeoutRef.current) {
        window.clearTimeout(flashEndTimeoutRef.current);
      }
    };
  }, []);

  const contextRef = useRef<RenderContext>({
    brief,
    resultsById,
    onCitationClick,
    selectedCitationId,
    flashCitationId,
  });
  contextRef.current = {
    brief,
    resultsById,
    onCitationClick,
    selectedCitationId,
    flashCitationId,
  };

  const renderInline = useCallback((children: ReactNode): ReactNode[] => {
    return renderInlineNodes(children, contextRef.current);
  }, []);

  const components = useMemo(
    () => ({
      h1: (props: MarkdownComponentProps<'h1'>) => {
        return <h1>{renderInline(props.children)}</h1>;
      },
      h2: (props: MarkdownComponentProps<'h2'>) => {
        return <h2>{renderInline(props.children)}</h2>;
      },
      h3: (props: MarkdownComponentProps<'h3'>) => {
        return <h3>{renderInline(props.children)}</h3>;
      },
      h4: (props: MarkdownComponentProps<'h4'>) => {
        return <h4>{renderInline(props.children)}</h4>;
      },
      h5: (props: MarkdownComponentProps<'h5'>) => {
        return <h5>{renderInline(props.children)}</h5>;
      },
      h6: (props: MarkdownComponentProps<'h6'>) => {
        return <h6>{renderInline(props.children)}</h6>;
      },
      p: (props: MarkdownComponentProps<'p'>) => {
        return <p>{renderInline(props.children)}</p>;
      },
      li: (props: MarkdownComponentProps<'li'>) => {
        return <li>{renderInline(props.children)}</li>;
      },
      blockquote: (props: MarkdownComponentProps<'blockquote'>) => {
        return <blockquote>{renderInline(props.children)}</blockquote>;
      },
      strong: (props: MarkdownComponentProps<'strong'>) => {
        return <strong>{renderInline(props.children)}</strong>;
      },
      em: (props: MarkdownComponentProps<'em'>) => {
        return <em>{renderInline(props.children)}</em>;
      },
    }),
    [renderInline]
  );

  return (
    <div className="doc-content">
      <ReactMarkdown components={components}>{brief.content}</ReactMarkdown>
    </div>
  );
}

function renderInlineNodes(children: ReactNode, context: RenderContext): ReactNode[] {
  return Children.toArray(children).flatMap((child, index) =>
    replaceCitations(child, context, index)
  );
}

function replaceCitations(
  node: ReactNode,
  context: RenderContext,
  keyIndex: number
): ReactNode[] {
  if (typeof node === 'string') {
    return splitCitationNodes(node, context, keyIndex);
  }

  if (isValidElement(node)) {
    const nextChildren = node.props.children
      ? renderInlineNodes(node.props.children, context)
      : node.props.children;
    const element = node as ReactElement<{ children?: ReactNode }>;

    return [cloneElement(element, { children: nextChildren })];
  }

  return [node];
}

function splitCitationNodes(
  text: string,
  context: RenderContext,
  keyIndex: number
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let citationCount = 0;

  CITATION_PATTERN.lastIndex = 0;

  while ((match = CITATION_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const citationIndex = Number(match[1]) - CITATION_INDEX_OFFSET;
    const citation = context.brief.citations[citationIndex];

    if (citation) {
      nodes.push(renderCitationNode(citation, context, `${keyIndex}-${citationCount}`));
      citationCount += 1;
    } else {
      nodes.push(match[0]);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderCitationNode(
  citation: Citation,
  context: RenderContext,
  key: string
): ReactNode {
  const result = context.resultsById.get(citation.id);
  const severity: Severity = result?.severity ?? 'none';
  const isSelected = context.selectedCitationId === citation.id;
  const isFlashing = context.flashCitationId === citation.id;

  return (
    <CitationChip
      key={`citation-${key}`}
      citation={citation}
      severity={severity}
      isSelected={isSelected}
      isFlashing={isFlashing}
      onSelect={context.onCitationClick}
    />
  );
}

interface CitationChipProps {
  citation: Citation;
  severity: Severity;
  isSelected: boolean;
  isFlashing: boolean;
  onSelect: (citationId: string) => void;
}

const CitationChip = memo(function CitationChip({
  citation,
  severity,
  isSelected,
  isFlashing,
  onSelect,
}: CitationChipProps): JSX.Element {
  const handleClick = useCallback(() => {
    onSelect(citation.id);
  }, [citation.id, onSelect]);

  return (
    <button
      type="button"
      className="citation-chip"
      data-severity={severity}
      data-selected={isSelected}
      data-flash={isFlashing}
      aria-pressed={isSelected}
      aria-label={`${citation.caseName} citation`}
      onClick={handleClick}
    >
      <span className="citation-dot" />
      <span>{citation.text}</span>
    </button>
  );
});
