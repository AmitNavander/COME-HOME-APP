import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AppErrorBoundary from './ui/AppErrorBoundary';
import './manifestation/journey.css';
import './index.css';
import './lib/auth'; // boot the auth session listener at startup

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary><App /></AppErrorBoundary>
  </StrictMode>,
);
