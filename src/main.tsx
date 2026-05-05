import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import '@/shared/presentation/i18n/config'; // Initialize i18n
import { GlobalErrorBoundary } from '@/shared/presentation/components/ErrorBoundary/GlobalErrorBoundary';
import { webSocketService } from '@/shared/infrastructure/services/WebSocketService';
import { environments } from '@/settings/environments/environments';

// ── Inicializar conexión WebSocket global ───────────────────────────────────
// Se conecta antes del primer render. Si el token aún no existe (usuario
// no logueado), se conecta sin autenticación y el backend lo acepta.
// Cuando el usuario hace login, se puede reconectar con el token real.
const savedToken = localStorage.getItem('auth_token') ?? undefined;
webSocketService.connect(environments.API_URL, savedToken);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>
);
