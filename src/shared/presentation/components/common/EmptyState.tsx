import React from 'react';
import { Info, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  description?: string;
  icon?: LucideIcon;
  minHeight?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  icon: Icon = Info,
  minHeight = '200px'
}) => {
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
        background: 'var(--surface)',
        borderRadius: '0.75rem',
        border: '1px dashed var(--border-color)',
        color: 'var(--text-secondary)'
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--surface-hover)',
          padding: '1rem',
          borderRadius: '50%',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon size={32} strokeWidth={1.5} color="var(--primary)" />
      </div>
      <h4
        style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text-main)'
        }}
      >
        {message}
      </h4>
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            maxWidth: '300px',
            color: 'var(--text-muted)'
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
