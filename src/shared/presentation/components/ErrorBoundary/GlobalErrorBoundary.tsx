import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '../Button/Button';
import './GlobalErrorBoundary.css';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React Tree:', error, errorInfo);
    this.setState({ errorInfo });
    // In a real application, you might want to log this error to an error reporting service like Sentry
  }

  private handleReload = () => {
    // Reload the page to clear the corrupted React state tree
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-wrapper">
          <div className="error-boundary-content">
            <div className="error-boundary-icon-wrapper">
              <AlertTriangle className="error-boundary-icon" size={64} />
            </div>
            <h1 className="error-boundary-title">¡Ups! Algo salió mal.</h1>
            <p className="error-boundary-message">
              Ha ocurrido un error inesperado al renderizar la aplicación. Por
              favor, recarga la página para intentarlo de nuevo.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="error-boundary-details">
                <p className="error-boundary-details-title">
                  Detalles del Error (Solo Desarrollo):
                </p>
                <code className="error-boundary-code">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="error-boundary-actions">
              <Button
                onClick={this.handleReload}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <RefreshCcw size={18} />
                Recargar Página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
