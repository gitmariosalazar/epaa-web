import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import './DatePicker.css';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

interface DatePickerProps {
  value: string; // Format: YYYY-MM-DD, YYYY-MM, or YYYY based on view
  onChange: (date: string) => void;
  disabled?: boolean;
  view?: 'date' | 'month' | 'year';
  size?: 'xs' | 'small' | 'compact' | 'medium' | 'large';
}

export interface DatePickerRef {
  showPicker: () => void;
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

  // Parse initial date or default to today in Ecuador time
  const initialDate = value
    ? new Date(value + 'T00:00:00')
    : dateService.getCurrentDate();

  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? initialDate : null
  );
  const [manualValue, setManualValue] = useState<string>(value || '');

  // Sync manual value when value prop changes
  useEffect(() => {
    setManualValue(value || '');
  }, [value]);

  // Close calendar if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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

  // Sync state if value prop changes externally
  useEffect(() => {
    if (value) {
      const parsed = new Date(value + 'T00:00:00');
      setSelectedDate(parsed);
      setCurrentMonth(parsed);
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const toggleCalendar = () => {
    if (!disabled) {
      if (!isOpen) {
        // Calculate alignment before opening
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const spaceRight = window.innerWidth - rect.left;
          const spaceBottom = window.innerHeight - rect.bottom;

          const horizontal = spaceRight < 300 ? 'right' : 'left';
          const vertical = spaceBottom < 350 ? 'top' : 'bottom';

          setAlignment({ horizontal, vertical });
        }
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
      // Optional: jump calendar to the new date
      const parsed = new Date(val + (view === 'date' ? 'T00:00:00' : view === 'month' ? '-01T00:00:00' : '-01-01T00:00:00'));
      if (!isNaN(parsed.getTime())) {
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

    // Format to YYYY-MM-DD local time safely avoiding timezone shifts
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const d = String(newDate.getDate()).padStart(2, '0');

    const formatted = `${year}-${month}-${d}`;
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
    if (!selectedDate)
      return view === 'month' ? 'Seleccionar Mes' : 'Select Date';
    if (view === 'month') {
      return `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    }
    if (view === 'year') {
      return selectedDate.getFullYear().toString();
    }
    return selectedDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
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

    // Previous month days
    const prevMonthDate = new Date(year, month, 0);
    const prevMonthLastDay = prevMonthDate.getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      days.push(
        <div
          key={`prev-${dayNum}`}
          className="datepicker-cell datepicker-cell--outside"
        >
          {dayNum}
        </div>
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

    // Next month days to complete 6 rows (42 cells)
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className="datepicker-cell datepicker-cell--outside"
        >
          {i}
        </div>
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
            const m = String(idx + 1).padStart(2, '0');
            onChange(`${year}-${m}`);
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
            onChange(yearToRender.toString());
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

      {isOpen && (
        <div
          ref={popoverRef}
          className={`datepicker-popover ${alignment.horizontal === 'right' ? 'datepicker-popover--right-aligned' : ''} ${alignment.vertical === 'top' ? 'datepicker-popover--top-aligned' : ''}`}
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
            <Button variant="ghost" size="sm" onClick={handleClear}>
              {t('common.datePicker.clear')}
            </Button>
            <div className="datepicker-footer-actions">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                {t('common.datePicker.cancel')}
              </Button>
              <Button
                variant="primary"
                size="sm"
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
        </div>
      )}
    </div>
  );
  }
);

DatePicker.displayName = 'DatePicker';
