import React from 'react';
import { Info } from 'lucide-react';
import './EmptyState.css';

export type EmptyStateVariant =
  | 'default'
  | 'success'
  | 'info'
  | 'warning'
  | 'error';

interface EmptyStateProps {
  message: string;
  description?: string;
  /** Puede ser un componente de icono (Lucide, React Icons) o un elemento JSX */
  icon?: React.ReactNode | React.ElementType;
  minHeight?: string;
  variant?: EmptyStateVariant;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  icon: Icon = Info,
  minHeight = '200px',
  variant = 'default'
}) => {
  const isDefault = variant === 'default';
  const iconColor = isDefault ? 'var(--primary)' : 'var(--empty-state-text)';

  const renderIcon = () => {
    if (!Icon) return null;

    // Si es un componente (función), lo renderizamos con los props estándar
    if (typeof Icon === 'function' || (typeof Icon === 'object' && 'render' in (Icon as any))) {
      const IconComponent = Icon as React.ElementType;
      return <IconComponent size={32} strokeWidth={1.5} color={iconColor} />;
    }

    // Si ya es un elemento React (JSX), lo renderizamos directamente
    return Icon as React.ReactNode;
  };

  return (
    <div
      className={`empty-state empty-state--${variant}`}
      style={{ minHeight: minHeight }}
    >
      <div className="empty-state__icon-wrapper">
        {renderIcon()}
      </div>
      <h4 className="empty-state__message">{message}</h4>
      {description && <p className="empty-state__description">{description}</p>}
    </div>
  );
};
