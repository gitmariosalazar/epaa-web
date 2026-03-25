import React, { useState, useRef, useLayoutEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
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
        return { t, l };
      };

      let { t, l } = calculate(position);
      let newActualPosition = position;

      // Vertical "flip"
      if (position === 'top' && t < 0) {
        ({ t, l } = calculate('bottom'));
        newActualPosition = 'bottom';
      } else if (position === 'bottom' && t + tooltipRect.height > viewportHeight) {
        ({ t, l } = calculate('top'));
        newActualPosition = 'top';
      }

      // Horizontal adjustment (shifting to stay within screen)
      if (l < 8) {
        l = 8;
      } else if (l + tooltipRect.width > viewportWidth - 8) {
        l = viewportWidth - tooltipRect.width - 8;
      }

      setCoords({ top: t + window.scrollY, left: l + window.scrollX });
      setActualPosition(newActualPosition);
    }
  }, [isVisible, position]);

  return (
    <div
      ref={triggerRef}
      className={`tooltip-container ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
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
              zIndex: 10000
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </div>
  );
};
