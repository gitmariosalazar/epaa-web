import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useCallback
} from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
  Check
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import './DateTimePicker.css';

export interface DateTimePickerProps {
  /**
   * Datetime string in standard format: 'YYYY-MM-DDTHH:mm' or 'YYYY-MM-DDTHH:mm:ss'
   */
  value: string;
  /**
   * Callback called with the updated 'YYYY-MM-DDTHH:mm' string or empty string '' on clear
   */
  onChange: (value: string) => void;
  /**
   * Minimum datetime allowed (e.g. 'YYYY-MM-DDTHH:mm' or 'YYYY-MM-DD')
   */
  min?: string;
  /**
   * Maximum datetime allowed
   */
  max?: string;
  disabled?: boolean;
  size?: 'xs' | 'small' | 'compact' | 'medium' | 'large';
  placeholder?: string;
  className?: string;
  clearable?: boolean;
  showPresets?: boolean;
}

export interface DateTimePickerRef {
  showPicker: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

export const DateTimePicker = React.forwardRef<
  DateTimePickerRef,
  DateTimePickerProps
>(
  (
    {
      value,
      onChange,
      min,
      max,
      disabled = false,
      size = 'medium',
      placeholder = 'Seleccionar fecha y hora',
      className = '',
      clearable = true,
      showPresets = true
    },
    ref
  ) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

    // Parse value helper
    const parseValue = useCallback((val: string) => {
      if (!val) return null;
      const normalized = val.replace(' ', 'T');
      const [datePart, timePart = ''] = normalized.split('T');
      if (!datePart) return null;
      const [y, m, d] = datePart.split('-').map(Number);
      if (!y || !m || !d || isNaN(y) || isNaN(m) || isNaN(d)) return null;

      let hours = 23;
      let minutes = 59;
      if (timePart) {
        const [h, min] = timePart.split(':').map(Number);
        if (!isNaN(h)) hours = Math.min(23, Math.max(0, h));
        if (!isNaN(min)) minutes = Math.min(59, Math.max(0, min));
      }
      return {
        year: y,
        month: m - 1,
        day: d,
        hours,
        minutes,
        dateStr: `${y}-${pad(m)}-${pad(d)}`
      };
    }, []);

    const parsedVal = useMemo(() => parseValue(value), [value, parseValue]);

    // Internal working state while popover is open
    const [currentMonth, setCurrentMonth] = useState<Date>(() => {
      if (parsedVal) {
        return new Date(parsedVal.year, parsedVal.month, 1);
      }
      const now = dateService.getCurrentDate();
      return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const [selectedDateStr, setSelectedDateStr] = useState<string>(
      parsedVal ? parsedVal.dateStr : ''
    );
    const [selectedHours, setSelectedHours] = useState<number>(
      parsedVal ? parsedVal.hours : 23
    );
    const [selectedMinutes, setSelectedMinutes] = useState<number>(
      parsedVal ? parsedVal.minutes : 59
    );

    // Sync state when external value changes
    useEffect(() => {
      if (parsedVal) {
        setSelectedDateStr(parsedVal.dateStr);
        setSelectedHours(parsedVal.hours);
        setSelectedMinutes(parsedVal.minutes);
        setCurrentMonth(new Date(parsedVal.year, parsedVal.month, 1));
      } else {
        setSelectedDateStr('');
      }
    }, [parsedVal]);

    // Popover positioning
    const updatePopoverPosition = useCallback(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const popoverWidth = 320;
      const popoverHeight = 440;
      const spaceRight = window.innerWidth - rect.left;
      const spaceBottom = window.innerHeight - rect.bottom;

      const horizontal = spaceRight < popoverWidth ? 'right' : 'left';
      const vertical = spaceBottom < popoverHeight ? 'top' : 'bottom';

      setPopoverStyle({
        position: 'fixed',
        top: vertical === 'bottom' ? rect.bottom + 4 : undefined,
        bottom:
          vertical === 'top' ? window.innerHeight - rect.top + 4 : undefined,
        left: horizontal === 'left' ? rect.left : undefined,
        right:
          horizontal === 'right' ? window.innerWidth - rect.right : undefined,
        zIndex: 99999,
        width: popoverWidth
      });
    }, []);

    const togglePopover = () => {
      if (!disabled) {
        if (!isOpen) {
          updatePopoverPosition();
        }
        setIsOpen(!isOpen);
      }
    };

    useImperativeHandle(ref, () => ({
      showPicker: togglePopover
    }));

    // Handle click outside and reposition on resize/scroll
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (e: MouseEvent) => {
        const inContainer = containerRef.current?.contains(e.target as Node);
        const inPopover = popoverRef.current?.contains(e.target as Node);
        if (!inContainer && !inPopover) {
          setIsOpen(false);
        }
      };

      const handleScrollOrResize = () => {
        updatePopoverPosition();
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, updatePopoverPosition]);

    // Min and Max constraints
    const minDateStr = useMemo(() => {
      if (!min) return null;
      return min.slice(0, 10);
    }, [min]);

    const maxDateStr = useMemo(() => {
      if (!max) return null;
      return max.slice(0, 10);
    }, [max]);

    // Month Navigation
    const prevMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
      );
    };

    const nextMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      );
    };

    // Day selection
    const handleSelectDay = (day: number) => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const dateStr = `${year}-${pad(month)}-${pad(day)}`;
      setSelectedDateStr(dateStr);
    };

    // Apply current selection
    const handleApply = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!selectedDateStr) {
        // Default to today if no day was selected yet
        const today = dateService.getCurrentDate();
        const dateStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
        const finalVal = `${dateStr}T${pad(selectedHours)}:${pad(selectedMinutes)}`;
        onChange(finalVal);
      } else {
        const finalVal = `${selectedDateStr}T${pad(selectedHours)}:${pad(selectedMinutes)}`;
        onChange(finalVal);
      }
      setIsOpen(false);
    };

    // Clear value
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedDateStr('');
      onChange('');
      setIsOpen(false);
    };

    // Quick presets
    const handleApplyPreset = (daysOffset: number, timeStr = '23:59') => {
      const target = dateService.getCurrentDate();
      target.setDate(target.getDate() + daysOffset);
      const y = target.getFullYear();
      const m = pad(target.getMonth() + 1);
      const d = pad(target.getDate());
      const dateStr = `${y}-${m}-${d}`;
      const [h, min] = timeStr.split(':').map(Number);

      setSelectedDateStr(dateStr);
      setSelectedHours(h);
      setSelectedMinutes(min);
      setCurrentMonth(new Date(target.getFullYear(), target.getMonth(), 1));

      // Auto-apply preset immediately
      onChange(`${dateStr}T${timeStr}`);
      setIsOpen(false);
    };

    // Set time chips
    const handleSetTimePreset = (h: number, m: number) => {
      setSelectedHours(h);
      setSelectedMinutes(m);
    };

    // Translations
    const monthNames = [
      t('common.months.january', 'Enero'),
      t('common.months.february', 'Febrero'),
      t('common.months.march', 'Marzo'),
      t('common.months.april', 'Abril'),
      t('common.months.may', 'Mayo'),
      t('common.months.june', 'Junio'),
      t('common.months.july', 'Julio'),
      t('common.months.august', 'Agosto'),
      t('common.months.september', 'Septiembre'),
      t('common.months.october', 'Octubre'),
      t('common.months.november', 'Noviembre'),
      t('common.months.december', 'Diciembre')
    ];

    const weekdayNames = [
      t('common.days.su', 'Do'),
      t('common.days.mo', 'Lu'),
      t('common.days.tu', 'Ma'),
      t('common.days.we', 'Mi'),
      t('common.days.th', 'Ju'),
      t('common.days.fr', 'Vi'),
      t('common.days.sa', 'Sá')
    ];

    // Calendar grid calculation
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const firstDayOfWeek = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();

    const renderCalendarGrid = () => {
      const cells = [];
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const today = dateService.getCurrentDate();
      const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

      for (let i = 0; i < firstDayOfWeek; i++) {
        cells.push(
          <div
            key={`empty-${i}`}
            className="datetimepicker-cell datetimepicker-cell--empty"
          />
        );
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const cellDateStr = `${year}-${pad(month)}-${pad(d)}`;
        const isSelected = selectedDateStr === cellDateStr;
        const isToday = todayStr === cellDateStr;
        const isDisabled =
          (minDateStr && cellDateStr < minDateStr) ||
          (maxDateStr && cellDateStr > maxDateStr);

        cells.push(
          <button
            key={d}
            type="button"
            disabled={Boolean(isDisabled)}
            className={`datetimepicker-cell datetimepicker-cell--day ${
              isSelected ? 'datetimepicker-cell--selected' : ''
            } ${isToday && !isSelected ? 'datetimepicker-cell--today' : ''} ${
              isDisabled ? 'datetimepicker-cell--disabled' : ''
            }`}
            onClick={() => handleSelectDay(d)}
          >
            {d}
          </button>
        );
      }

      return cells;
    };

    // Formatted trigger label
    const formatDisplay = () => {
      if (!parsedVal) return null;
      const { year, month, day, hours, minutes } = parsedVal;
      const shortMonths = [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic'
      ];
      const timeStr = `${pad(hours)}:${pad(minutes)}`;

      if (size === 'xs') {
        return `${pad(day)}/${pad(month + 1)}/${year} ${timeStr}`;
      }
      return `${pad(day)} ${shortMonths[month]} ${year}, ${timeStr}`;
    };

    const displayLabel = formatDisplay();

    return (
      <div
        ref={containerRef}
        className={`datetimepicker-container datetimepicker--${size} ${className}`}
      >
        <button
          type="button"
          className={`datetimepicker-trigger ${
            disabled ? 'datetimepicker-trigger--disabled' : ''
          } ${isOpen ? 'datetimepicker-trigger--active' : ''}`}
          onClick={togglePopover}
          disabled={disabled}
        >
          <CalendarIcon className="datetimepicker-icon" />

          {displayLabel ? (
            <span className="datetimepicker-value">{displayLabel}</span>
          ) : (
            <span className="datetimepicker-value datetimepicker-value--placeholder">
              {placeholder}
            </span>
          )}

          <div className="datetimepicker-trigger-actions">
            {clearable && value && !disabled && (
              <button
                type="button"
                className="datetimepicker-clear-btn"
                onClick={handleClear}
                title="Limpiar fecha"
              >
                <X size={13} />
              </button>
            )}
            <Clock className="datetimepicker-clock-icon" />
          </div>
        </button>

        {isOpen &&
          createPortal(
            <div
              ref={popoverRef}
              className="datetimepicker-popover"
              style={popoverStyle}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Presets Bar */}
              {showPresets && (
                <div className="datetimepicker-presets">
                  <button
                    type="button"
                    className="datetimepicker-preset-btn"
                    onClick={() => handleApplyPreset(0, '23:59')}
                    title="Hoy a las 23:59"
                  >
                    Hoy fin de día
                  </button>
                  <button
                    type="button"
                    className="datetimepicker-preset-btn"
                    onClick={() => handleApplyPreset(1, '23:59')}
                    title="Mañana a las 23:59"
                  >
                    +1 día
                  </button>
                  <button
                    type="button"
                    className="datetimepicker-preset-btn"
                    onClick={() => handleApplyPreset(7, '23:59')}
                    title="En 7 días"
                  >
                    +7 días
                  </button>
                  <button
                    type="button"
                    className="datetimepicker-preset-btn"
                    onClick={() => handleApplyPreset(30, '23:59')}
                    title="En 30 días"
                  >
                    +30 días
                  </button>
                  <button
                    type="button"
                    className="datetimepicker-preset-btn"
                    onClick={() => handleApplyPreset(90, '23:59')}
                    title="En 90 días"
                  >
                    +90 días
                  </button>
                  <button
                    type="button"
                    className="datetimepicker-preset-btn"
                    onClick={() => handleApplyPreset(365, '23:59')}
                    title="En 1 año"
                  >
                    +1 año
                  </button>
                </div>
              )}

              {/* Month Navigation */}
              <div className="datetimepicker-header">
                <button
                  type="button"
                  className="datetimepicker-nav-btn"
                  onClick={prevMonth}
                  title="Mes anterior"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="datetimepicker-month-title">
                  {monthNames[currentMonth.getMonth()]}{' '}
                  {currentMonth.getFullYear()}
                </span>
                <button
                  type="button"
                  className="datetimepicker-nav-btn"
                  onClick={nextMonth}
                  title="Mes siguiente"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Weekday Labels */}
              <div className="datetimepicker-weekdays">
                {weekdayNames.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              {/* Calendar Days Grid */}
              <div className="datetimepicker-grid">{renderCalendarGrid()}</div>

              {/* Time Picker Controls */}
              <div className="datetimepicker-time-section">
                <div className="datetimepicker-time-header">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Clock size={13} color="var(--primary, #3b82f6)" />
                    <span>Hora de expiración:</span>
                  </div>
                  <div className="datetimepicker-time-chips">
                    <button
                      type="button"
                      className={`datetimepicker-time-chip ${
                        selectedHours === 12 && selectedMinutes === 0
                          ? 'datetimepicker-time-chip--active'
                          : ''
                      }`}
                      onClick={() => handleSetTimePreset(12, 0)}
                    >
                      12:00
                    </button>
                    <button
                      type="button"
                      className={`datetimepicker-time-chip ${
                        selectedHours === 18 && selectedMinutes === 0
                          ? 'datetimepicker-time-chip--active'
                          : ''
                      }`}
                      onClick={() => handleSetTimePreset(18, 0)}
                    >
                      18:00
                    </button>
                    <button
                      type="button"
                      className={`datetimepicker-time-chip ${
                        selectedHours === 23 && selectedMinutes === 59
                          ? 'datetimepicker-time-chip--active'
                          : ''
                      }`}
                      onClick={() => handleSetTimePreset(23, 59)}
                    >
                      23:59
                    </button>
                  </div>
                </div>

                <div className="datetimepicker-time-controls">
                  <div className="datetimepicker-time-pickers">
                    <select
                      className="datetimepicker-time-select"
                      value={pad(selectedHours)}
                      onChange={(e) => setSelectedHours(Number(e.target.value))}
                    >
                      {Array.from({ length: 24 }).map((_, h) => (
                        <option key={h} value={pad(h)}>
                          {pad(h)} hrs
                        </option>
                      ))}
                    </select>
                    <span className="datetimepicker-time-sep">:</span>
                    <select
                      className="datetimepicker-time-select"
                      value={pad(selectedMinutes)}
                      onChange={(e) =>
                        setSelectedMinutes(Number(e.target.value))
                      }
                    >
                      {Array.from({ length: 60 }).map((_, m) => (
                        <option key={m} value={pad(m)}>
                          {pad(m)} min
                        </option>
                      ))}
                    </select>
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-secondary, #64748b)',
                      fontWeight: 600
                    }}
                  >
                    {pad(selectedHours)}:{pad(selectedMinutes)}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="datetimepicker-footer">
                <div className="datetimepicker-footer-left">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={handleClear}
                  >
                    {t('common.datePicker.clear', 'Limpiar')}
                  </Button>
                </div>
                <div className="datetimepicker-footer-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('common.datePicker.cancel', 'Cancelar')}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="xs"
                    onClick={handleApply}
                    leftIcon={<Check size={13} />}
                  >
                    {t('common.datePicker.selectDate', 'Aplicar')}
                  </Button>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    );
  }
);

DateTimePicker.displayName = 'DateTimePicker';
