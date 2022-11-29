import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import LocaleProvider from './providers/LocaleProvider';
import TranslationProvider from './providers/TranslationProvider';

async function render() {
  const $container = document.getElementById('root');
  const root = createRoot($container!);

  root.render(
    <StrictMode>
      <LocaleProvider>
        <TranslationProvider>
          <App />
        </TranslationProvider>
      </LocaleProvider>
    </StrictMode>,
  );
}

document.addEventListener('DOMContentLoaded', render, { once: true });
