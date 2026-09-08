import React, { useState } from 'react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { PasswordInput } from '@/shared/presentation/components/Input/PasswordInput';
import { Button } from '@/shared/presentation/components/Button/Button';
import { LockKeyhole, ShieldAlert } from 'lucide-react';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { PiLockKeyOpenFill } from "react-icons/pi";
import './RequireElevatedToken.css';

interface RequireElevatedTokenProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

export const RequireElevatedToken: React.FC<RequireElevatedTokenProps> = ({
  children,
  fallbackMessage = 'Este módulo requiere acceso especial. Por favor ingresa tu PIN de seguridad para continuar.'
}) => {
  const { isModuleSpecialUnlocked, unlockModule, isLoading } = useAuth();

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Por favor ingresa tu PIN');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await unlockModule(pin);
    } catch (err: any) {
      console.error('Error unlocking module:', err);
      setError(err?.response?.data?.message || err?.message || 'PIN incorrecto o error al verificar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="require-token-loading">
        <CircularProgress progress={100} size={80} label="Verificando sesión..." />
      </div>
    );
  }

  if (isModuleSpecialUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="require-token-wrapper">
      <div className="require-token-card">
        <div className="require-token-icon-wrapper">
          <LockKeyhole size={34} />
        </div>

        <h2 className="require-token-title">
          Módulo Restringido
        </h2>

        <p className="require-token-subtitle">
          {fallbackMessage}
        </p>

        {error && (
          <div className="require-token-error">
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="require-token-form">
          <PasswordInput
            label="PIN de Seguridad"
            placeholder="Ingresa tu PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            error={error ? ' ' : undefined} // Don't show text under input since we have banner
            autoFocus
          />

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting || !pin}
            leftIcon={<PiLockKeyOpenFill size={18} />}
            size="lg"
          >
            Desbloquear Módulo
          </Button>
        </form>
      </div>
    </div>
  );
};
