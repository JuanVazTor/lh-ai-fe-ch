# Trusted Hand - Citation Review

## Overview
A polished, production-style experience for reviewing legal citations in an annotated brief. The interface focuses on readability, fast triage, and trustworthy feedback without overwhelming the user.

## Highlights
- Markdown rendering with inline, clickable citations
- Citation queue with counts and filters
- Verification details panel with status messaging
- Timeline modal for chronological review
- Focus Mode for distraction-free reading
- Export notes as .txt
- Keyboard navigation between citations
- Subtle motion and feedback tuned for calmness

## Stack
Vite + React 18 + TypeScript, Tailwind (utility base + custom CSS), react-markdown, sonner.

## Local setup
```
npm install
npm run dev
```

Open http://localhost:5173

## Scripts
```
npm run dev
npm run build
npm run preview
```

## Project structure
```
src/
├── features/
│   └── brief/
│       ├── components/
│       │   ├── BriefViewer.tsx
│       │   ├── layout/
│       │   ├── modals/
│       │   └── panels/
│       ├── data/
│       ├── hooks/
│       └── lib/
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```
