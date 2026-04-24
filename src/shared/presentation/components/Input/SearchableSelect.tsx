import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X, Check } from 'lucide-react';
import '@/shared/presentation/styles/SearchableSelect.css';

export interface SearchableSelectOption {
  value: string | number;
  label: string;
}

interface SearchableSelectProps {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  size?: 'small' | 'compact' | 'medium' | 'large';
  className?: string;
  focused?: boolean;
}

export interface SearchableSelectRef {
  focus: () => void;
  open: () => void;
  close: () => void;
}

export const SearchableSelect = forwardRef<SearchableSelectRef, SearchableSelectProps>(
  ({ label, value, onChange, options, placeholder = 'Select...', error, disabled = false, size = 'medium', className = '', focused }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [alignment, setAlignment] = useState<'bottom' | 'top'>('bottom');
    const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
    
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const isClearingRef = useRef(false);

    // Find current label based on value
    const selectedOption = options.find(opt => opt.value === value);
    
    useEffect(() => {
      if (focused && inputRef.current) {
        inputRef.current.focus();
      }
    }, [focused]);
    
    useEffect(() => {
      if (isClearingRef.current) {
        if (value === '' || value === undefined || value === null) {
          isClearingRef.current = false;
        }
        return;
      }
      if (!isOpen) {
        setSearchTerm(selectedOption ? selectedOption.label : '');
      }
    }, [value, selectedOption, isOpen]);

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
          width: rect.width,
          zIndex: 9999,
        });
        setAlignment(alignTop ? 'top' : 'bottom');
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
        const isClickInContainer = containerRef.current && containerRef.current.contains(event.target as Node);
        const isClickInPopover = popoverRef.current && popoverRef.current.contains(event.target as Node);
        
        if (!isClickInContainer && !isClickInPopover) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        // Use timeout to prevent immediate close if opened via click
        setTimeout(() => {
          document.addEventListener('mousedown', handleClickOutside);
        }, 0);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      open: () => handleOpen(),
      close: () => setIsOpen(false)
    }));

    const handleOpen = () => {
      if (disabled) return;
      updatePosition();
      setIsOpen(true);
    };

    const handleOptionSelect = (option: SearchableSelectOption) => {
      onChange(option.value);
      setSearchTerm(option.label);
      setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      if (!isOpen) handleOpen();
    };

    const handleInputFocus = () => {
      if (!isOpen && !isClearingRef.current) handleOpen();
    };

    const filteredOptions = options.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleClear = (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      isClearingRef.current = true;
      onChange('');
      setSearchTerm('');
      
      // Close dropdown if it's open
      setIsOpen(false);
      
      // Do not auto-focus as it would reopen the popover
      if (document.activeElement === inputRef.current) {
         inputRef.current?.blur();
      }
    };

    const toggleOpen = (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!disabled) {
        if (isOpen) setIsOpen(false);
        else handleOpen();
      }
    };

    return (
      <div 
        className={`input-component searchable-select-container searchable-select--${size} ${isOpen ? 'searchable-select-container--open' : ''} ${className}`}
        ref={containerRef}
      >
        {label && <label className="input__label">{label}</label>}
        
        <div className="searchable-select-trigger">
          <input
            ref={inputRef}
            type="text"
            className={`searchable-select-input ${error ? 'searchable-select-input--error' : ''} ${disabled ? 'searchable-select-input--disabled' : ''}`}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
          />
          
          <div className="searchable-select-actions" style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 10 }}>
            {searchTerm && !disabled && (
              <button 
                type="button"
                onPointerDown={handleClear}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                title="Clear"
              >
                <X size={size === 'small' || size === 'compact' ? 14 : 18} />
              </button>
            )}
            <button
              type="button"
              onPointerDown={toggleOpen}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}
              title="Toggle"
            >
              <ChevronDown size={size === 'small' || size === 'compact' ? 14 : 18} />
            </button>
          </div>
        </div>

        {isOpen && !disabled && createPortal(
          <div 
            ref={popoverRef}
            className={`searchable-select-popover ${alignment === 'top' ? 'searchable-select-popover--top-aligned' : ''}`}
            style={popoverStyle}
          >
            <ul className="searchable-select-options-list">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(opt => (
                  <li
                    key={opt.value}
                    className={`searchable-select-option ${opt.value === value ? 'searchable-select-option--selected' : ''}`}
                    onClick={() => handleOptionSelect(opt)}
                  >
                    <span className="searchable-select-option-label">{opt.label}</span>
                    {opt.value === value && <Check size={16} className="searchable-select-option-check" />}
                  </li>
                ))
              ) : (
                <li className="searchable-select-no-results">No results found</li>
              )}
            </ul>
          </div>,
          document.body
        )}
        
        {error && <span className="input__error">{error}</span>}
      </div>
    );
  }
);

SearchableSelect.displayName = 'SearchableSelect';
