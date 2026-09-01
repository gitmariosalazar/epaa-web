import React, { useState } from 'react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { PasswordInput } from '@/shared/presentation/components/Input/PasswordInput';
import { Button } from '@/shared/presentation/components/Button/Button';
import { LockKeyhole, ShieldAlert } from 'lucide-react';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '3rem' }}>
        <CircularProgress progress={100} size={80} label="Verificando sesión..." />
      </div>
    );
  }

  if (isModuleSpecialUnlocked) {
    return <>{children}</>;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      minHeight: '400px',
      padding: '2rem',
      backgroundColor: 'var(--color-bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      margin: '1rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface)',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ 
          display: 'inline-flex', 
          padding: '1rem', 
          backgroundColor: 'var(--color-warning-soft)', 
          color: 'var(--color-warning-dark)', 
          borderRadius: '50%',
          marginBottom: '1.5rem'
        }}>
          <LockKeyhole size={32} />
        </div>
        
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 600, 
          color: 'var(--color-text-primary)',
          marginBottom: '1rem'
        }}>
          Módulo Restringido
        </h2>
        
        <p style={{ 
          color: 'var(--color-text-secondary)',
          marginBottom: '2rem',
          lineHeight: 1.5
        }}>
          {fallbackMessage}
        </p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            backgroundColor: 'var(--color-error-soft)',
            color: 'var(--color-error-dark)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            textAlign: 'left'
          }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            loading={isSubmitting}
            disabled={isSubmitting || !pin}
          >
            Desbloquear Módulo
          </Button>
        </form>
      </div>
    </div>
  );
};
