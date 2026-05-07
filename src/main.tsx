import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import '@/shared/presentation/i18n/config'; // Initialize i18n
import { GlobalErrorBoundary } from '@/shared/presentation/components/ErrorBoundary/GlobalErrorBoundary';
// La conexión WebSocket ya NO se hace aquí.
// AuthContext gestiona el ciclo de vida completo:
//  - login  → realtimeService.connect(url, token)   ← autenticado
//  - logout → realtimeService.disconnect()           ← sin reconexión automática

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>
);
