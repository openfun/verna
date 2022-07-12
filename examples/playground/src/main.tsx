import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import LocaleProvider from './providers/LocaleProvider';
import TranslationProvider from './providers/TranslationProvider';

async function render() {
  ReactDOM.render(
    <StrictMode>
      <LocaleProvider>
        <TranslationProvider>
          <App />
        </TranslationProvider>
      </LocaleProvider>
    </StrictMode>,
    document.getElementById('root'),
  );
}

document.addEventListener('DOMContentLoaded', render, { once: true });
