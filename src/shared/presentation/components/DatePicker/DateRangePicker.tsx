import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import './DateRangePicker.css';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  disabled?: boolean;
  size?: 'xs' | 'small' | 'compact' | 'medium' | 'large';
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  disabled = false,
  size = 'medium'
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentMonth, setCurrentMonth] = useState(() =>
    startDate ? new Date(startDate + 'T00:00:00') : dateService.getCurrentDate()
  );

  const [tempStart, setTempStart] = useState<string>(startDate);
  const [tempEnd, setTempEnd] = useState<string>(endDate);

  // Sync with props when closed
  useEffect(() => {
    if (!isOpen) {
      setTempStart(startDate);
      setTempEnd(endDate);
    }
  }, [startDate, endDate, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

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

  const handleDateClick = (dateStr: string) => {
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(dateStr);
      setTempEnd('');
    } else {
      let finalStart = tempStart;
      let finalEnd = dateStr;

      if (dateStr < tempStart) {
        finalStart = dateStr;
        finalEnd = tempStart;
      }

      setTempStart(finalStart);
      setTempEnd(finalEnd);

      // Auto-apply selection without closing immediately
      onChange(finalStart, finalEnd);
    }
  };

  const renderCalendar = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    const today = dateService.getCurrentDateString();

    // Previous month days
    const prevMonthDate = new Date(year, month, 0);
    const prevMonthLastDay = prevMonthDate.getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      days.push(
        <div
          key={`prev-${dayNum}`}
          className="date-range-picker-cell date-range-picker-cell--outside"
        >
          {dayNum}
        </div>
      );
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isStart = tempStart === dateStr;
      const isEnd = tempEnd === dateStr;
      const isInRange =
        tempStart && tempEnd && dateStr > tempStart && dateStr < tempEnd;
      const isToday = today === dateStr;

      days.push(
        <button
          key={i}
          type="button"
          className={`date-range-picker-cell 
            ${isStart ? 'date-range-picker-cell--selected date-range-picker-cell--range-start' : ''} 
            ${isEnd ? 'date-range-picker-cell--selected date-range-picker-cell--range-end' : ''} 
            ${isInRange ? 'date-range-picker-cell--in-range' : ''}
            ${isToday ? 'date-range-picker-cell--today' : ''}
          `}
          onClick={() => handleDateClick(dateStr)}
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
          className="date-range-picker-cell date-range-picker-cell--outside"
        >
          {i}
        </div>
      );
    }

    return days;
  };

  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );

  const secondMonth = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    [currentMonth]
  );

  const isValidDate = (dateStr: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
    const date = new Date(dateStr + 'T00:00:00');
    return !isNaN(date.getTime());
  };

  const handleManualStartChange = (val: string) => {
    setTempStart(val);
    if (isValidDate(val) && tempEnd && isValidDate(tempEnd)) {
      onChange(val, tempEnd);
      // Optional: jump calendar to the new date
      setCurrentMonth(new Date(val + 'T00:00:00'));
    } else if (isValidDate(val) && !tempEnd) {
      setCurrentMonth(new Date(val + 'T00:00:00'));
    }
  };

  const handleManualEndChange = (val: string) => {
    setTempEnd(val);
    if (tempStart && isValidDate(tempStart) && isValidDate(val)) {
      onChange(tempStart, val);
    }
  };

  const handleApply = () => {
    if (
      tempStart &&
      tempEnd &&
      isValidDate(tempStart) &&
      isValidDate(tempEnd)
    ) {
      onChange(tempStart, tempEnd);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setTempStart('');
    setTempEnd('');
    onChange('', '');
  };

  return (
    <div className="date-range-picker-container" ref={containerRef}>
      <button
        type="button"
        className={`date-range-picker-trigger date-range-picker--${size} ${isOpen ? 'date-range-picker-trigger--active' : ''} ${disabled ? 'date-range-picker-trigger--disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <CalendarIcon
          className="date-range-picker-icon"
          size={size === 'xs' || size === 'small' ? 14 : 18}
        />
        <span>{startDate || t('common.dateRange.start', 'Desde')}</span>
        <ArrowRight
          size={size === 'xs' || size === 'small' ? 12 : 14}
          className="date-separator"
        />
        <span>{endDate || t('common.dateRange.end', 'Hasta')}</span>
      </button>

      {isOpen && (
        <div className="date-range-picker-popover">
          <div className="date-range-picker-calendars">
            <div className="date-range-picker-calendar">
              <div className="date-range-picker-header">
                <button
                  type="button"
                  className="date-range-picker-nav-btn"
                  onClick={prevMonth}
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="date-range-picker-month-title">
                  {monthNames[currentMonth.getMonth()]}{' '}
                  {currentMonth.getFullYear()}
                </span>
                <div style={{ width: 36 }} />
              </div>
              <div className="date-range-picker-weekdays">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                  <span key={`${d}-${i}`}>{d}</span>
                ))}
              </div>
              <div className="date-range-picker-grid">
                {renderCalendar(currentMonth)}
              </div>
            </div>

            <div className="date-range-picker-calendar">
              <div className="date-range-picker-header">
                <div style={{ width: 36 }} />
                <span className="date-range-picker-month-title">
                  {monthNames[secondMonth.getMonth()]}{' '}
                  {secondMonth.getFullYear()}
                </span>
                <button
                  type="button"
                  className="date-range-picker-nav-btn"
                  onClick={nextMonth}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="date-range-picker-weekdays">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                  <span key={`${d}-${i}`}>{d}</span>
                ))}
              </div>
              <div className="date-range-picker-grid">
                {renderCalendar(secondMonth)}
              </div>
            </div>
          </div>

          <div className="date-range-picker-footer">
            <div className="date-range-picker-info-panel">
              <div className="date-range-picker-labels">
                <span className="date-range-picker-label">
                  <CalendarIcon size={14} />
                  {t('common.dateRange.selected', 'Rango')}:
                </span>
                <div
                  className="date-range-picker-input-boxes"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <input
                    type="text"
                    className="date-range-picker-manual-input"
                    value={tempStart}
                    onChange={(e) => handleManualStartChange(e.target.value)}
                    placeholder="YYYY-MM-DD"
                  />
                  <ArrowRight size={12} style={{ opacity: 0.5 }} />
                  <input
                    type="text"
                    className="date-range-picker-manual-input"
                    value={tempEnd}
                    onChange={(e) => handleManualEndChange(e.target.value)}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>
            </div>

            <div className="date-range-picker-actions">
              <Button variant="ghost" size="sm" onClick={handleClear}>
                {t('common.clear', 'Limpiar')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                {t('common.cancel', 'Cancelar')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApply}
                disabled={!tempStart || !tempEnd}
                style={{ minWidth: '100px' }}
              >
                {t('common.apply', 'Aplicar')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
