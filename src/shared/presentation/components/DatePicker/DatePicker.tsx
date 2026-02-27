import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './DatePicker.css';

interface DatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (date: string) => void;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial date or default to today
  const initialDate = value ? new Date(value + 'T00:00:00') : new Date();

  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? initialDate : null
  );

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
      setIsOpen(!isOpen);
    }
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
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

    onChange(`${year}-${month}-${d}`);
    setIsOpen(false);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getFormattedDateDisplay = () => {
    if (!selectedDate) return 'Select Date';
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

      const isToday =
        new Date().getDate() === i &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

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

  return (
    <div className="datepicker-container" ref={containerRef}>
      <button
        className={`datepicker-trigger ${disabled ? 'datepicker-trigger--disabled' : ''} ${isOpen ? 'datepicker-trigger--active' : ''}`}
        onClick={toggleCalendar}
        disabled={disabled}
        type="button"
      >
        <CalendarIcon className="datepicker-icon" size={16} />
        <span className="datepicker-value">{getFormattedDateDisplay()}</span>
      </button>

      {isOpen && (
        <div className="datepicker-popover">
          <div className="datepicker-header">
            <button
              className="datepicker-nav-btn"
              onClick={prevMonth}
              type="button"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="datepicker-month-title">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              className="datepicker-nav-btn"
              onClick={nextMonth}
              type="button"
            >
              <ChevronRight size={16} />
            </button>
          </div>

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
        </div>
      )}
    </div>
  );
};
