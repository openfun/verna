import React from 'react';
import App from ':/App';
import DragAndDropProvider from ':/providers/DragAndDropProvider';
import LocaleProvider from ':/providers/LocaleProvider';
import StatsProvider from ':/providers/StatsProvider';
import TranslationProvider from ':/providers/TranslationProvider';

export default function AppWrapper() {
  return (
    <LocaleProvider>
      <TranslationProvider>
        <DragAndDropProvider>
          <StatsProvider>
            <App />
          </StatsProvider>
        </DragAndDropProvider>
      </TranslationProvider>
    </LocaleProvider>
  );
}
