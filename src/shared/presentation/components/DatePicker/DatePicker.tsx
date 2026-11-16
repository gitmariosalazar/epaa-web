import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import './DatePicker.css';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

type DatePickerView = 'date' | 'month' | 'year';

interface DatePickerProps {
  value?: string | Date | null; // Format: YYYY-MM-DD, YYYY-MM, YYYY, or Date instance
  onChange: (date: string) => void;
  disabled?: boolean;
  view?: DatePickerView;
  size?: 'xs' | 'small' | 'medium' | 'large';
}

export interface DatePickerRef {
  showPicker: () => void;
}

/**
 * SRP / Clean Architecture: Parser robusto y puro para interpretar cualquier
 * valor de entrada de fecha (Date, ISO string, YYYY-MM-DD, etc.) sin efectos
 * secundarios ni dependencias del DOM o React.
 */
function parseSafeDate(value: unknown, view: DatePickerView = 'date'): Date | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // 1. Manejo seguro si ya es una instancia de Date
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return null;
    // Si fue parseado como medianoche UTC desde "YYYY-MM-DD", evitar desplazamiento de día local
    if (
      value.getUTCHours() === 0 &&
      value.getUTCMinutes() === 0 &&
      value.getHours() !== 0
    ) {
      return new Date(
        value.getUTCFullYear(),
        value.getUTCMonth(),
        value.getUTCDate()
      );
    }
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  // 2. Si es de otro tipo (número timestamp, etc.)
  if (typeof value !== 'string') {
    const d = new Date(value as number);
    if (isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  const trimmed = value.trim();
  if (
    !trimmed ||
    trimmed === 'undefined' ||
    trimmed === 'null' ||
    trimmed.toLowerCase().includes('invalid')
  ) {
    return null;
  }

  // 3. Extracción de YYYY-MM-DD (cubre formatos como "2026-11-16", "2026-11-16T...", "2026-11-16 12:00:00")
  const dateMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    const year = Number(dateMatch[1]);
    const month = Number(dateMatch[2]) - 1;
    const day = Number(dateMatch[3]);
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? null : d;
  }

  // 4. Si la vista es mensual o coincide con YYYY-MM
  const monthMatch = trimmed.match(/^(\d{4})-(\d{2})/);
  if (view === 'month' && monthMatch) {
    const year = Number(monthMatch[1]);
    const month = Number(monthMatch[2]) - 1;
    const d = new Date(year, month, 1);
    return isNaN(d.getTime()) ? null : d;
  }

  // 5. Si la vista es anual o coincide con YYYY
  const yearMatch = trimmed.match(/^(\d{4})/);
  if (view === 'year' && yearMatch) {
    const year = Number(yearMatch[1]);
    const d = new Date(year, 0, 1);
    return isNaN(d.getTime()) ? null : d;
  }

  // 6. Fallback seguro para otros formatos parseables por Date
  const fallback = new Date(trimmed);
  if (!isNaN(fallback.getTime())) {
    return new Date(
      fallback.getFullYear(),
      fallback.getMonth(),
      fallback.getDate()
    );
  }

  return null;
}

/**
 * SRP / Clean Architecture: Formateador canónico para las salidas de fecha
 * emitidas por el DatePicker.
 */
function formatDateOutput(date: Date, view: DatePickerView = 'date'): string {
  if (!date || isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  if (view === 'year') return year.toString();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  if (view === 'month') return `${year}-${month}`;
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const DatePicker = React.forwardRef<DatePickerRef, DatePickerProps>(
  ({ value, onChange, disabled = false, view = 'date', size = 'medium' }, ref) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [alignment, setAlignment] = useState<{
      horizontal: 'left' | 'right';
      vertical: 'bottom' | 'top';
    }>({ horizontal: 'left', vertical: 'bottom' });
    const containerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

    // Parse defensivo del valor inicial o fallback al día actual en Ecuador
    const parsedInitial = parseSafeDate(value, view);
    const initialCalendarDate = parsedInitial || dateService.getCurrentDate();

    const [currentMonth, setCurrentMonth] = useState<Date>(initialCalendarDate);
    const [selectedDate, setSelectedDate] = useState<Date | null>(parsedInitial);
    const [manualValue, setManualValue] = useState<string>(
      parsedInitial
        ? formatDateOutput(parsedInitial, view)
        : typeof value === 'string' && !value.toLowerCase().includes('invalid')
          ? value
          : ''
    );

    // Close calendar if clicking outside (check both container and portal popover)
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const isInContainer = containerRef.current?.contains(event.target as Node);
        const isInPopover = popoverRef.current?.contains(event.target as Node);
        if (!isInContainer && !isInPopover) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    // Sincronizar estado cuando la prop value o view cambie externamente
    useEffect(() => {
      if (value) {
        const parsed = parseSafeDate(value, view);
        if (parsed) {
          setSelectedDate(parsed);
          setCurrentMonth(parsed);
          setManualValue(formatDateOutput(parsed, view));
        } else {
          setSelectedDate(null);
          setManualValue(
            typeof value === 'string' && !value.toLowerCase().includes('invalid')
              ? value
              : ''
          );
        }
      } else {
        setSelectedDate(null);
        setManualValue('');
      }
    }, [value, view]);

    // Compute fixed position for the portal popover
    const updatePopoverPosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceRight = window.innerWidth - rect.left;
        const spaceBottom = window.innerHeight - rect.bottom;
        const horizontal = spaceRight < 300 ? 'right' : 'left';
        const vertical = spaceBottom < 450 ? 'top' : 'bottom';
        setAlignment({ horizontal, vertical });
        setPopoverStyle({
          position: 'fixed',
          top: vertical === 'bottom' ? rect.bottom + 4 : undefined,
          bottom: vertical === 'top' ? window.innerHeight - rect.top + 4 : undefined,
          left: horizontal === 'left' ? rect.left : undefined,
          right: horizontal === 'right' ? window.innerWidth - rect.right : undefined,
          zIndex: 99999,
          width: 280
        });
      }
    };

    const toggleCalendar = () => {
      if (!disabled) {
        if (!isOpen) {
          updatePopoverPosition();
        }
        setIsOpen(!isOpen);
      }
    };

    useImperativeHandle(ref, () => ({
      showPicker: toggleCalendar
    }));

    const nextMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (view === 'year') {
        setCurrentMonth(
          new Date(currentMonth.getFullYear() + 12, 0, 1)
        );
      } else {
        setCurrentMonth(
          new Date(
            currentMonth.getFullYear() + (view === 'month' ? 1 : 0),
            currentMonth.getMonth() + (view === 'month' ? 0 : 1),
            1
          )
        );
      }
    };

    const prevMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (view === 'year') {
        setCurrentMonth(
          new Date(currentMonth.getFullYear() - 12, 0, 1)
        );
      } else {
        setCurrentMonth(
          new Date(
            currentMonth.getFullYear() - (view === 'month' ? 1 : 0),
            currentMonth.getMonth() - (view === 'month' ? 0 : 1),
            1
          )
        );
      }
    };

    const isValidDate = (dateStr: string) => {
      if (view === 'date') return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
      if (view === 'month') return /^\d{4}-\d{2}$/.test(dateStr);
      if (view === 'year') return /^\d{4}$/.test(dateStr);
      return false;
    };

    const handleManualChange = (val: string) => {
      setManualValue(val);
      if (isValidDate(val)) {
        onChange(val);
        const parsed = parseSafeDate(val, view);
        if (parsed && !isNaN(parsed.getTime())) {
          setCurrentMonth(parsed);
          setSelectedDate(parsed);
        }
      }
    };

    const handleDateSelect = (day: number) => {
      const newDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      setSelectedDate(newDate);

      const formatted = formatDateOutput(newDate, 'date');
      setManualValue(formatted);
      onChange(formatted);
      setIsOpen(false);
    };

    const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
      return new Date(year, month, 1).getDay();
    };

    const getFormattedDateDisplay = () => {
      if (!selectedDate || isNaN(selectedDate.getTime())) {
        return view === 'month' ? 'Seleccionar Mes' : 'Select Date';
      }
      if (view === 'month') {
        const monthIdx = selectedDate.getMonth();
        return `${monthNames[monthIdx] || ''} ${selectedDate.getFullYear()}`;
      }
      if (view === 'year') {
        return selectedDate.getFullYear().toString();
      }
      const formatted = selectedDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return formatted === 'Invalid Date' ? 'Select Date' : formatted;
    };

    const monthNames = [
      t('common.months.january', 'Jan'),
      t('common.months.february', 'Feb'),
      t('common.months.march', 'Mar'),
      t('common.months.april', 'Apr'),
      t('common.months.may', 'May'),
      t('common.months.june', 'Jun'),
      t('common.months.july', 'Jul'),
      t('common.months.august', 'Aug'),
      t('common.months.september', 'Sep'),
      t('common.months.october', 'Oct'),
      t('common.months.november', 'Nov'),
      t('common.months.december', 'Dec')
    ];

    const renderCalendarDays = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const firstDay = getFirstDayOfMonth(year, month);

      const days = [];

      // Empty cells for days before the 1st of the month
      for (let i = 0; i < firstDay; i++) {
        days.push(
          <div
            key={`empty-${i}`}
            className="datepicker-cell datepicker-cell--empty"
          ></div>
        );
      }

      // Actual days
      for (let i = 1; i <= daysInMonth; i++) {
        const isSelected =
          selectedDate?.getDate() === i &&
          selectedDate?.getMonth() === month &&
          selectedDate?.getFullYear() === year;

        const ecuadorToday = dateService.getCurrentDate();
        const isToday =
          ecuadorToday.getDate() === i &&
          ecuadorToday.getMonth() === month &&
          ecuadorToday.getFullYear() === year;

        days.push(
          <button
            key={i}
            className={`datepicker-cell datepicker-cell--day ${isSelected ? 'datepicker-cell--selected' : ''} ${isToday && !isSelected ? 'datepicker-cell--today' : ''}`}
            onClick={() => handleDateSelect(i)}
          >
            {i}
          </button>
        );
      }

      return days;
    };

    const renderMonthGrid = () => {
      const year = currentMonth.getFullYear();

      return monthNames.map((mName, idx) => {
        const isSelected =
          selectedDate?.getMonth() === idx &&
          selectedDate?.getFullYear() === year;

        return (
          <button
            key={idx}
            type="button"
            className={`datepicker-month-cell ${isSelected ? 'datepicker-month-cell--selected' : ''}`}
            onClick={() => {
              const newDate = new Date(year, idx, 1);
              setSelectedDate(newDate);
              const formatted = formatDateOutput(newDate, 'month');
              setManualValue(formatted);
              onChange(formatted);
              setIsOpen(false);
            }}
          >
            {mName}
          </button>
        );
      });
    };

    const renderYearGrid = () => {
      const startYear = Math.floor(currentMonth.getFullYear() / 12) * 12;
      const years = [];

      for (let i = 0; i < 12; i++) {
        const yearToRender = startYear + i;
        const isSelected = selectedDate?.getFullYear() === yearToRender;

        years.push(
          <button
            key={yearToRender}
            type="button"
            className={`datepicker-month-cell ${isSelected ? 'datepicker-month-cell--selected' : ''}`}
            onClick={() => {
              const newDate = new Date(yearToRender, 0, 1);
              setSelectedDate(newDate);
              const formatted = formatDateOutput(newDate, 'year');
              setManualValue(formatted);
              onChange(formatted);
              setIsOpen(false);
            }}
          >
            {yearToRender}
          </button>
        );
      }
      return years;
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setManualValue('');
      setSelectedDate(null);
      onChange('');
      setIsOpen(false);
    };

    return (
      <div className={`datepicker-container datepicker--${size}`} ref={containerRef}>
        <button
          className={`datepicker-trigger ${disabled ? 'datepicker-trigger--disabled' : ''} ${isOpen ? 'datepicker-trigger--active' : ''}`}
          onClick={toggleCalendar}
          disabled={disabled}
          type="button"
        >
          <CalendarIcon className="datepicker-icon" />
          <span className="datepicker-value">{getFormattedDateDisplay()}</span>
        </button>

        {isOpen && createPortal(
          <div
            ref={popoverRef}
            className={`datepicker-popover ${alignment.horizontal === 'right' ? 'datepicker-popover--right-aligned' : ''} ${alignment.vertical === 'top' ? 'datepicker-popover--top-aligned' : ''}`}
            style={popoverStyle}
          >
            <div className="datepicker-header">
              <button
                className="datepicker-nav-btn"
                onClick={prevMonth}
                type="button"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="datepicker-month-title">
                {view === 'year'
                  ? `${Math.floor(currentMonth.getFullYear() / 12) * 12} - ${Math.floor(currentMonth.getFullYear() / 12) * 12 + 11}`
                  : view === 'month'
                    ? currentMonth.getFullYear()
                    : `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}
              </span>
              <button
                className="datepicker-nav-btn"
                onClick={nextMonth}
                type="button"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {view === 'date' ? (
              <>
                <div className="datepicker-weekdays">
                  <span>{t('common.days.su', 'Su')}</span>
                  <span>{t('common.days.mo', 'Mo')}</span>
                  <span>{t('common.days.tu', 'Tu')}</span>
                  <span>{t('common.days.we', 'We')}</span>
                  <span>{t('common.days.th', 'Th')}</span>
                  <span>{t('common.days.fr', 'Fr')}</span>
                  <span>{t('common.days.sa', 'Sa')}</span>
                </div>
                <div className="datepicker-grid">{renderCalendarDays()}</div>
              </>
            ) : view === 'month' ? (
              <div className="datepicker-months-grid">{renderMonthGrid()}</div>
            ) : (
              <div className="datepicker-months-grid">{renderYearGrid()}</div>
            )}
            <div className="datepicker-footer">
              <input
                type="text"
                className="datepicker-manual-input"
                value={manualValue}
                placeholder={view === 'date' ? 'YYYY-MM-DD' : view === 'month' ? 'YYYY-MM' : 'YYYY'}
                onChange={(e) => handleManualChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <Button variant="ghost" size="xs" onClick={handleClear}>
                {t('common.datePicker.clear')}
              </Button>
              <div className="datepicker-footer-actions">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                >
                  {t('common.datePicker.cancel')}
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (manualValue) {
                      onChange(manualValue);
                      setIsOpen(false);
                    }
                  }}
                  disabled={!manualValue}
                >
                  {t('common.datePicker.selectDate')}
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

DatePicker.displayName = 'DatePicker';
