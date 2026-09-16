import React, { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';
import type { SearchableSelectOption } from '../Input/SearchableSelect';
import { createPortal } from 'react-dom';
import { Select } from '../Input/Select';
import type { FilterModel } from './types/TableFilter';
import type { FilterConfig } from './Table';

interface TableColumnFilterProps {
  options?: SearchableSelectOption[];
  configs?: FilterConfig[];
  filterKeyStr?: string;
  activeFilters: FilterModel[];
  onChange: (key: string, value: string) => void;
}

export const TableColumnFilter: React.FC<TableColumnFilterProps> = ({
  options,
  configs,
  filterKeyStr,
  activeFilters,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Check if any filter is active for this column
  const isAnyActive = configs
    ? configs.some(c => activeFilters.some(f => f.columnField === c.key && f.value))
    : activeFilters.some(f => f.columnField === filterKeyStr && f.value);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBottom = window.innerHeight - rect.bottom;
      const spaceTop = rect.top;
      const alignTop = spaceBottom < 250 && spaceTop > spaceBottom;

      setPopoverStyle({
        position: 'fixed',
        top: alignTop ? 'auto' : rect.bottom + 4,
        bottom: alignTop ? window.innerHeight - rect.top + 4 : 'auto',
        left: rect.left,
        minWidth: '220px',
        zIndex: 99999,
        background: 'var(--background)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickInContainer = containerRef.current?.contains(event.target as Node);
      const isClickInPopover = popoverRef.current?.contains(event.target as Node);
      // Ignoramos los clics dentro del dropdown del Select para evitar que cierre el popover
      const isClickInSelectDropdown = (event.target as Element).closest?.('.select__dropdown');

      if (!isClickInContainer && !isClickInPopover && !isClickInSelectDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="table-column-filter-container" style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '4px' }}>
      <button
        type="button"
        style={{
          padding: '2px',
          background: isAnyActive ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: isAnyActive ? 'var(--primary-color)' : 'var(--text-muted)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title="Filtrar columna"
      >
        <Filter size={14} strokeWidth={isAnyActive ? 2.5 : 2} />
      </button>

      {isOpen && createPortal(
        <div ref={popoverRef} style={popoverStyle} onClick={(e) => e.stopPropagation()}>
          <div style={{ marginBottom: '12px', fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
            Filtrar Columna
          </div>

          {configs ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {configs.map(conf => {
                const currentVal = activeFilters.find(f => f.columnField === conf.key)?.value;
                return (
                  <Select
                    key={conf.key}
                    label={conf.label}
                    value={currentVal ? String(currentVal) : ''}
                    options={[{ label: 'Todos', value: '' }, ...conf.options]}
                    onChange={(e) => {
                      onChange(conf.key, e.target.value);
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <Select
              value={(() => {
                const f = activeFilters.find(f => f.columnField === filterKeyStr);
                return f ? String(f.value) : '';
              })()}
              options={[{ label: 'Todos', value: '' }, ...(options || [])]}
              onChange={(e) => {
                if (filterKeyStr) onChange(filterKeyStr, e.target.value);
              }}
            />
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
