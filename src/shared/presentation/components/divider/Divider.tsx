import React from 'react';
import './Divider.css';

interface DividerProps {
  /** Tipo de divisor */
  variant?: 'solid' | 'dashed' | 'dotted' | 'subtle';
  /** Orientación */
  orientation?: 'horizontal' | 'vertical';
  /** Texto centrado (opcional) */
  label?: string;
  /** Grosor del divisor */
  thickness?: 'thin' | 'medium' | 'thick';
  /** Margen vertical (solo horizontal) */
  margin?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  variant = 'solid',
  orientation = 'horizontal',
  label,
  thickness = 'medium',
  margin = 'md',
  className = '',
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={`
        divider 
        divider-${variant} 
        divider-${thickness}
        divider-${margin}
        ${isHorizontal ? 'divider-horizontal' : 'divider-vertical'}
        ${className}
      `.trim()}
    >
      {label && isHorizontal && (
        <div className="divider-label">
          <span>{label}</span>
        </div>
      )}
    </div>
  );
};