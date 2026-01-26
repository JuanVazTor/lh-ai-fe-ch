import React from 'react';
import { Toaster } from 'sonner';
import { BriefPage } from './features/brief/BriefPage.tsx';

const TOAST_DURATION_MS = 2200;
const TOAST_OFFSET = { top: 'var(--space-5)', right: 'var(--space-5)' };
const TOAST_MOBILE_OFFSET = {
  top: 'var(--space-4)',
  right: 'var(--space-4)',
  left: 'var(--space-4)',
};

function App(): JSX.Element {
  return (
    <React.Fragment>
      <BriefPage />
      <Toaster
        position="top-right"
        theme="light"
        closeButton={false}
        duration={TOAST_DURATION_MS}
        offset={TOAST_OFFSET}
        mobileOffset={TOAST_MOBILE_OFFSET}
        toastOptions={{
          classNames: {
            toast: 'toast',
            title: 'toast-title',
            description: 'toast-description',
            icon: 'toast-icon',
          },
        }}
      />
    </React.Fragment>
  );
}

export default App;
