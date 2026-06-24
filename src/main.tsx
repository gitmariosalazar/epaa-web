import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import '@/shared/presentation/i18n/config'; // Initialize i18n
import { GlobalErrorBoundary } from '@/shared/presentation/components/ErrorBoundary/GlobalErrorBoundary';

// Google Translate (and other translation tools) can modify the DOM behind React's back.
// This monkey-patch prevents React from crashing when it tries to update/remove nodes
// that have been wrapped/replaced by the translator.
if (typeof window !== 'undefined') {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (this: any, child: any) {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.call(this, child);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (this: any, newNode: any, referenceNode: any) {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  };
}

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
