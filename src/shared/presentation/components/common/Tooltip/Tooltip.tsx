import React, { useState, useRef, useLayoutEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  className?: string;
  disabled?: boolean;
  as?: React.ElementType;
  themeColor?: string; // Mantained for backward compatibility
  backgroundColor?: string;
  textColor?: string;
  icon?: ReactNode;
  variant?: 'soft' | 'solid' | 'transparent';
  followCursor?: boolean;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
  disabled = false,
  as: Component = 'div',
  themeColor,
  backgroundColor,
  textColor,
  icon,
  variant = 'soft',
  followCursor = false,
  onMouseEnter,
  onMouseLeave
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, arrowLeft: '50%', arrowTop: '50%' });
  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number } | null>(null);
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef<any>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const calculate = (pos: TooltipPosition) => {
        let t = 0;
        let l = 0;
        let targetX = 0;
        let targetY = 0;

        if (followCursor && mouseCoords) {
          targetX = mouseCoords.x;
          targetY = mouseCoords.y;
          switch (pos) {
            case 'top':
              t = mouseCoords.y - tooltipRect.height - 8;
              l = mouseCoords.x - tooltipRect.width / 2;
              break;
            case 'bottom':
              t = mouseCoords.y + 8;
              l = mouseCoords.x - tooltipRect.width / 2;
              break;
            case 'left':
              t = mouseCoords.y - tooltipRect.height / 2;
              l = mouseCoords.x - tooltipRect.width - 8;
              break;
            case 'right':
              t = mouseCoords.y - tooltipRect.height / 2;
              l = mouseCoords.x + 8;
              break;
          }
        } else {
          targetX = triggerRect.left + triggerRect.width / 2;
          targetY = triggerRect.top + triggerRect.height / 2;
          switch (pos) {
            case 'top':
              t = triggerRect.top - tooltipRect.height - 8;
              l = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
              break;
            case 'bottom':
              t = triggerRect.bottom + 8;
              l = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
              break;
            case 'left':
              t = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
              l = triggerRect.left - tooltipRect.width - 8;
              break;
            case 'right':
              t = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
              l = triggerRect.left + triggerRect.width + 8;
              break;
          }
        }
        return { t, l, targetX, targetY };
      };

      let { t, l, targetX, targetY } = calculate(position);
      let newActualPosition = position;

      // Vertical "flip"
      if (position === 'top' && t < 0) {
        ({ t, l, targetX, targetY } = calculate('bottom'));
        newActualPosition = 'bottom';
      } else if (position === 'bottom' && t + tooltipRect.height > viewportHeight) {
        ({ t, l, targetX, targetY } = calculate('top'));
        newActualPosition = 'top';
      }

      // Horizontal adjustment (shifting to stay within screen)
      if (l < 8) {
        l = 8;
      } else if (l + tooltipRect.width > viewportWidth - 8) {
        l = viewportWidth - tooltipRect.width - 8;
      }

      let arrowLeft = '50%';
      let arrowTop = '50%';
      const arrowMargin = 14; // Prevent arrow from going over the rounded borders

      if (newActualPosition === 'top' || newActualPosition === 'bottom') {
        let calculatedArrowX = targetX - l;
        calculatedArrowX = Math.max(arrowMargin, Math.min(tooltipRect.width - arrowMargin, calculatedArrowX));
        arrowLeft = `${calculatedArrowX}px`;
      } else {
        let calculatedArrowY = targetY - t;
        calculatedArrowY = Math.max(arrowMargin, Math.min(tooltipRect.height - arrowMargin, calculatedArrowY));
        arrowTop = `${calculatedArrowY}px`;
      }

      setCoords({ top: t + window.scrollY, left: l + window.scrollX, arrowLeft, arrowTop });
      setActualPosition(newActualPosition);
    }
  }, [isVisible, position, followCursor, mouseCoords]);

  useLayoutEffect(() => {
    if (disabled && isVisible) {
      setIsVisible(false);
    }
  }, [disabled, isVisible]);

  return (
    <Component
      ref={triggerRef}
      className={`tooltip-container ${className}`}
      onMouseEnter={(e: React.MouseEvent) => {
        if (!disabled) {
          if (followCursor) setMouseCoords({ x: e.clientX, y: e.clientY });
          setIsVisible(true);
        }
        onMouseEnter?.(e);
      }}
      onMouseMove={(e: React.MouseEvent) => {
        if (!disabled && followCursor) {
          setMouseCoords({ x: e.clientX, y: e.clientY });
        }
      }}
      onMouseLeave={(e: React.MouseEvent) => {
        setIsVisible(false);
        if (followCursor) setMouseCoords(null);
        onMouseLeave?.(e);
      }}
    >
      {children}
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`tooltip-box tooltip-${actualPosition} tooltip-visible`}
            style={{
              position: 'absolute',
              top: coords.top,
              left: coords.left,
              opacity: 1,
              visibility: 'visible',
              transition: 'opacity 0.2s ease',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              
              background: (() => {
                if (backgroundColor) return backgroundColor;
                if (variant === 'transparent') return 'color-mix(in srgb, var(--surface) 40%, transparent)';
                const baseColor = themeColor 
                  ? `var(--palette-${themeColor}, var(--${themeColor}, ${themeColor}))` 
                  : 'var(--surface)';
                
                if (variant === 'solid' && themeColor) return baseColor;
                if (variant === 'soft' && themeColor) return `color-mix(in srgb, ${baseColor} 15%, var(--surface))`;
                return 'var(--surface)';
              })(),

              color: textColor || 'var(--text-main)',
              
              border: themeColor 
                ? `1px solid color-mix(in srgb, var(--palette-${themeColor}, var(--${themeColor}, ${themeColor})) 40%, transparent)` 
                : variant === 'transparent' ? '1px solid color-mix(in srgb, var(--text-main) 10%, transparent)' : '1px solid var(--border-color)',
              
              '--tooltip-arrow-color': (() => {
                if (backgroundColor) return backgroundColor;
                if (variant === 'transparent') return 'color-mix(in srgb, var(--surface) 95%, transparent)';
                const baseColor = themeColor 
                  ? `var(--palette-${themeColor}, var(--${themeColor}, ${themeColor}))` 
                  : 'var(--surface)';
                
                if (variant === 'solid' && themeColor) return baseColor;
                if (variant === 'soft' && themeColor) return `color-mix(in srgb, ${baseColor} 15%, var(--surface))`;
                return 'var(--surface)';
              })(),

              '--tooltip-arrow-border-color': themeColor 
                ? `color-mix(in srgb, var(--palette-${themeColor}, var(--${themeColor}, ${themeColor})) 40%, transparent)` 
                : variant === 'transparent' ? 'color-mix(in srgb, var(--text-main) 10%, transparent)' : 'var(--border-color)',
              
              '--tooltip-arrow-left': coords.arrowLeft,
              '--tooltip-arrow-top': coords.arrowTop,
              backdropFilter: variant === 'transparent' ? 'blur(12px)' : 'blur(8px)',
            } as React.CSSProperties}
          >
            {icon && <span className="tooltip-icon">{icon}</span>}
            <span className="tooltip-content-text">{content}</span>
          </div>,
          document.body
        )}
    </Component>
  );
};
