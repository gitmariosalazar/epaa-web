import React from 'react';
import { Info, type LucideIcon } from 'lucide-react';

export type EmptyStateVariant =
  | 'default'
  | 'success'
  | 'info'
  | 'warning'
  | 'error';

interface EmptyStateProps {
  message: string;
  description?: string;
  icon?: LucideIcon;
  minHeight?: string;
  variant?: EmptyStateVariant;
}

const VARIANT_STYLES: Record<
  EmptyStateVariant,
  { text: string; bg: string; border: string; iconBg: string }
> = {
  default: {
    text: 'var(--text-main)',
    bg: 'var(--surface)',
    border: 'var(--border-color)',
    iconBg: 'var(--surface-hover)'
  },
  success: {
    text: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.05)',
    border: 'rgba(34, 197, 94, 0.3)',
    iconBg: 'rgba(34, 197, 94, 0.15)'
  },
  info: {
    text: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.05)',
    border: 'rgba(59, 130, 246, 0.3)',
    iconBg: 'rgba(59, 130, 246, 0.15)'
  },
  warning: {
    text: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.05)',
    border: 'rgba(245, 158, 11, 0.3)',
    iconBg: 'rgba(245, 158, 11, 0.15)'
  },
  error: {
    text: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.05)',
    border: 'rgba(239, 68, 68, 0.3)',
    iconBg: 'rgba(239, 68, 68, 0.15)'
  }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  icon: Icon = Info,
  minHeight = '200px',
  variant = 'default'
}) => {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.default;
  const isDefault = variant === 'default';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: minHeight,
        padding: '2rem',
        textAlign: 'center',
        background: styles.bg,
        borderRadius: '0.75rem',
        border: `1px dashed ${styles.border}`,
        color: 'var(--text-secondary)'
      }}
    >
      <div
        style={{
          backgroundColor: styles.iconBg,
          padding: '1rem',
          borderRadius: '50%',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon
          size={32}
          strokeWidth={1.5}
          color={isDefault ? 'var(--primary)' : styles.text}
        />
      </div>
      <h4
        style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1rem',
          fontWeight: 600,
          color: styles.text
        }}
      >
        {message}
      </h4>
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            maxWidth: '400px',
            color: isDefault ? 'var(--text-muted)' : 'var(--text-secondary)'
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
