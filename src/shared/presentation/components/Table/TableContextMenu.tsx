import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './TableContextMenu.css';

export interface ContextMenuItem<T> {
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  disabled?: boolean | ((item: T) => boolean);
  divider?: boolean;
  color?: 'default' | 'primary' | 'secondary' | 'accent' | 'danger' | 'warning' | 'success' | 'info' | 'purple' | 'pink' | 'orange' | 'cyan';
}

interface TableContextMenuProps<T> {
  isOpen: boolean;
  x: number;
  y: number;
  item: T | null;
  menuItems: ContextMenuItem<T>[];
  onClose: () => void;
}

export function TableContextMenu<T>({ isOpen, x, y, item, menuItems, onClose }: TableContextMenuProps<T>) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: y, left: x });

  useEffect(() => {
    if (!isOpen) return;
    
    // Adjust position if it overflows the window
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let newTop = y;
      let newLeft = x;
      
      if (x + rect.width > window.innerWidth) {
        newLeft = window.innerWidth - rect.width - 10;
      }
      if (y + rect.height > window.innerHeight) {
        newTop = window.innerHeight - rect.height - 10;
      }
      setPosition({ top: newTop, left: newLeft });
    }
  }, [isOpen, x, y]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    // Use setTimeout to avoid closing immediately if triggered by a click event that bubbles
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 0);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const content = (
    <div 
      className="table-context-menu" 
      style={{ top: position.top, left: position.left }} 
      ref={menuRef} 
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {menuItems.map((menuItem, index) => {
        if (menuItem.divider) {
          return <div key={`divider-${index}`} className="table-context-menu-divider" />;
        }
        
        const isDisabled = typeof menuItem.disabled === 'function' ? menuItem.disabled(item) : menuItem.disabled;
        const colorClass = menuItem.color && menuItem.color !== 'default' ? `table-context-menu-item--${menuItem.color}` : '';
        
        return (
          <button
            key={index}
            className={`table-context-menu-item ${colorClass}`}
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              menuItem.onClick(item);
              onClose();
            }}
          >
            {menuItem.icon && <span className="table-context-menu-item-icon">{menuItem.icon}</span>}
            <span className="table-context-menu-item-label">{menuItem.label}</span>
          </button>
        );
      })}
    </div>
  );

  return createPortal(content, document.body);
}
