import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import './styles/theme.css';
import { App } from './app/App';

// Fetch every weight now, not on first use, so a venue Wi-Fi drop mid-demo can't change the typography.
for (const weight of [400, 500, 600, 700]) void document.fonts.load(`${weight} 1em "Plus Jakarta Sans"`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
