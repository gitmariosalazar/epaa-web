import React, {
  type SelectHTMLAttributes,
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import '@/shared/presentation/styles/Input.css';
import '@/shared/presentation/styles/Select.css';

interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'size'
> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  /** Custom right icon. Defaults to ChevronDown. Pass `null` to disable. */
  rightIcon?: React.ReactNode | null;
  children?: React.ReactNode;
  options?: { value: string | number; label: string }[];
  size?: 'small' | 'compact' | 'medium' | 'large';
  focused?: boolean;
  /** Sets the width of the select container. */
  width?: string | number;
  /** Aligns the entire component within its parent flex/grid container. */
  align?: 'left' | 'center' | 'right';
}

/** Extracts { value, label } pairs from <option> children. */
function parseOptions(
  children: React.ReactNode,
  optionsProp?: { value: string | number; label: string }[]
): { value: string; label: string }[] {
  if (optionsProp && optionsProp.length) {
    return optionsProp.map((o) => ({ value: String(o.value), label: o.label }));
  }
  const result: { value: string; label: string }[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const el = child as React.ReactElement<
      React.OptionHTMLAttributes<HTMLOptionElement>
    >;
    if (el.type === 'option') {
      const val = String(el.props.value ?? '');
      // Handle: plain string, or array [string, string|boolean] (e.g. {label}{cond ? '...' : ''})
      const rawChildren = el.props.children;
      let label: string;
      if (typeof rawChildren === 'string') {
        label = rawChildren;
      } else if (Array.isArray(rawChildren)) {
        label = rawChildren
          .filter((c) => typeof c === 'string' || typeof c === 'number')
          .join('')
          .trim();
        if (!label) label = val;
      } else {
        label = val;
      }
      result.push({ value: val, label });
    }
  });
  return result;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon, // managed internally
      className = '',
      children,
      size = 'medium',
      options,
      focused,
      width,
      align,
      value,
      defaultValue,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropStyle, setDropStyle] = useState<React.CSSProperties>({});
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);
    const nativeRef = useRef<HTMLSelectElement>(null);

    // Forward ref to the hidden native select
    const handleRef = (node: HTMLSelectElement | null) => {
      (nativeRef as React.MutableRefObject<HTMLSelectElement | null>).current =
        node;
      if (typeof ref === 'function') ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLSelectElement | null>).current =
          node;
    };

    const opts = useMemo(
      () => parseOptions(children, options),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [children, options]
    );

    const currentValue = String(value ?? defaultValue ?? opts[0]?.value ?? '');
    const selectedLabel =
      opts.find((o) => o.value === currentValue)?.label ?? currentValue;

    /** Calculate whether the dropdown should open above or below. */
    const calcPosition = useCallback(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const estimatedH = Math.min(opts.length * 36 + 12, 260);
      const spaceBelow = vh - rect.bottom - 6;
      const openAbove = spaceBelow < estimatedH && rect.top > estimatedH;

      setDropStyle({
        position: 'fixed',
        left: rect.left,
        width: rect.width,
        minWidth: rect.width,
        zIndex: 999999,
        ...(openAbove
          ? { bottom: vh - rect.top + 4 }
          : { top: rect.bottom + 4 })
      });
    }, [opts.length]);

    const open = useCallback(() => {
      if (disabled) return;
      calcPosition();
      setIsOpen(true);
    }, [disabled, calcPosition]);

    const close = useCallback(() => setIsOpen(false), []);

    /** Fire onChange like a native <select> change event. */
    const handleSelect = useCallback(
      (val: string) => {
        if (onChange) {
          const syntheticEvent = {
            target: { value: val, name: props.name } as HTMLSelectElement,
            currentTarget: { value: val, name: props.name } as HTMLSelectElement
          } as React.ChangeEvent<HTMLSelectElement>;
          onChange(syntheticEvent);
        }
        close();
      },
      [onChange, close, props.name]
    );

    // Close when clicking outside
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        if (
          triggerRef.current?.contains(e.target as Node) ||
          dropRef.current?.contains(e.target as Node)
        )
          return;
        close();
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, close]);

    // Reposition on scroll / resize while open
    useEffect(() => {
      if (!isOpen) return;
      window.addEventListener('scroll', calcPosition, true);
      window.addEventListener('resize', calcPosition);
      return () => {
        window.removeEventListener('scroll', calcPosition, true);
        window.removeEventListener('resize', calcPosition);
      };
    }, [isOpen, calcPosition]);

    // Focus trigger if focused prop is set
    useEffect(() => {
      if (focused && triggerRef.current) triggerRef.current.focus();
    }, [focused]);

    const alignSelfMap = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end'
    } as const;

    const chevron = isOpen ? (
      <ChevronUp size={14} />
    ) : (
      <ChevronDown size={14} />
    );
    const displayIcon = rightIcon !== undefined ? rightIcon : chevron;

    const containerStyle: React.CSSProperties = {
      // Prevent the trigger from overflowing its parent flex group
      minWidth: 0,
      overflow: 'hidden',
      ...(width !== undefined
        ? { width: typeof width === 'number' ? `${width}px` : width }
        : {}),
      ...(align !== undefined ? { alignSelf: alignSelfMap[align] } : {})
    };

    return (
      <div
        className={`input-component input--${size} ${className}`}
        style={containerStyle}
      >
        {label && <label className="input__label">{label}</label>}

        {/* ── Trigger ─────────────────────────────────────────────────── */}
        <div
          ref={triggerRef}
          className={`input__container select__trigger${isOpen ? ' input__container--focused' : ''}${disabled ? ' input__container--disabled select__trigger--disabled' : ''}${error ? ' input__container--error' : ''}`}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          onClick={() => (isOpen ? close() : open())}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              isOpen ? close() : open();
            }
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowDown' && !isOpen) open();
          }}
        >
          {leftIcon && <span className="input__icon-left">{leftIcon}</span>}
          <span
            className={`input__field input__field--select select__value${leftIcon ? ' input__field--with-icon' : ''}${displayIcon !== null ? ' input__field--with-right-icon' : ''}`}
          >
            {selectedLabel || '\u00A0'}
          </span>
          {displayIcon !== null && (
            <span className="input__icon-right" aria-hidden="true">
              {displayIcon}
            </span>
          )}
        </div>

        {/* Hidden native select — preserves form & ref compatibility */}
        <select
          ref={handleRef}
          value={currentValue}
          onChange={onChange}
          disabled={disabled}
          aria-hidden="true"
          tabIndex={-1}
          {...props}
          style={{ display: 'none' }}
        >
          {children ??
            options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
        </select>

        {error && <span className="input__error">{error}</span>}

        {/* ── Portal dropdown ──────────────────────────────────────────── */}
        {isOpen &&
          createPortal(
            <div
              ref={dropRef}
              role="listbox"
              className="select__dropdown"
              style={dropStyle}
            >
              {opts.map((opt) => (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === currentValue}
                  className={`select__option${opt.value === currentValue ? ' select__option--selected' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(opt.value);
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>,
            document.body
          )}
      </div>
    );
  }
);

Select.displayName = 'Select';
