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
  size?: 'xs' | 'small' | 'small' | 'medium' | 'large';
  mode?: 'date' | 'month';
  maxDate?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  disabled = false,
  size = 'medium',
  mode = 'date',
  maxDate
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverDate, setHoverDate] = useState<string>('');

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

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="date-range-picker-cell date-range-picker-cell--empty"
        />
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

      let currentEnd = tempEnd;
      if (!tempEnd && tempStart && hoverDate) {
        currentEnd = hoverDate;
      }

      let actualStart = tempStart;
      let actualEnd = currentEnd;

      if (actualStart && actualEnd && actualEnd < actualStart) {
        actualStart = currentEnd;
        actualEnd = tempStart;
      }

      const isStart = actualStart === dateStr;
      const isEnd = actualEnd === dateStr;
      const isInRange = actualStart && actualEnd && dateStr > actualStart && dateStr < actualEnd;
      const isToday = today === dateStr;
      const isAfterMax = maxDate ? dateStr > maxDate : false;

      days.push(
        <button
          key={i}
          type="button"
          disabled={isAfterMax}
          className={`date-range-picker-cell 
            ${isStart ? 'date-range-picker-cell--selected date-range-picker-cell--range-start' : ''} 
            ${isEnd ? 'date-range-picker-cell--selected date-range-picker-cell--range-end' : ''} 
            ${isInRange ? 'date-range-picker-cell--in-range' : ''}
            ${isToday ? 'date-range-picker-cell--today' : ''}
            ${isAfterMax ? 'date-range-picker-cell--disabled' : ''}
          `}
          onClick={() => !isAfterMax && handleDateClick(dateStr)}
          onMouseEnter={() => !isAfterMax && setHoverDate(dateStr)}
          onMouseLeave={() => setHoverDate('')}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  const handleMonthClick = (year: number, monthIndex: number) => {
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
    handleDateClick(dateStr);
  };

  const renderMonthsCalendar = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const today = dateService.getCurrentDateString();
    const currentTodayMonthStr = today.substring(0, 7);
    const startMonthStr = tempStart ? tempStart.substring(0, 7) : '';
    const endMonthStr = tempEnd ? tempEnd.substring(0, 7) : '';

    return monthNames.map((monthName, index) => {
      const cellMonthStr = `${year}-${String(index + 1).padStart(2, '0')}`;
      const hoverMonthStr = hoverDate ? hoverDate.substring(0, 7) : '';

      let currentEndStr = endMonthStr;
      if (!tempEnd && tempStart && hoverMonthStr) {
        currentEndStr = hoverMonthStr;
      }

      let actualStartStr = startMonthStr;
      let actualEndStr = currentEndStr;

      if (actualStartStr && actualEndStr && actualEndStr < actualStartStr) {
        actualStartStr = currentEndStr;
        actualEndStr = startMonthStr;
      }

      const isStart = actualStartStr === cellMonthStr;
      const isEnd = actualEndStr === cellMonthStr;
      const isInRange = actualStartStr && actualEndStr && cellMonthStr > actualStartStr && cellMonthStr < actualEndStr;
      const isToday = currentTodayMonthStr === cellMonthStr;

      const maxMonthStr = maxDate ? maxDate.substring(0, 7) : null;
      const isAfterMax = maxMonthStr ? cellMonthStr > maxMonthStr : false;

      return (
        <button
          key={index}
          type="button"
          disabled={isAfterMax}
          className={`date-range-picker-cell date-range-picker-cell--month
            ${isStart ? 'date-range-picker-cell--selected date-range-picker-cell--range-start' : ''} 
            ${isEnd ? 'date-range-picker-cell--selected date-range-picker-cell--range-end' : ''} 
            ${isInRange ? 'date-range-picker-cell--in-range' : ''}
            ${isToday ? 'date-range-picker-cell--today' : ''}
            ${isAfterMax ? 'date-range-picker-cell--disabled' : ''}
          `}
          onClick={() => !isAfterMax && handleMonthClick(year, index)}
          onMouseEnter={() => !isAfterMax && setHoverDate(`${cellMonthStr}-01`)}
          onMouseLeave={() => setHoverDate('')}
        >
          {monthName.substring(0, 3)}
        </button>
      );
    });
  };

  const nextMonth = () => {
    if (mode === 'month') {
      setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1));
    } else {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    }
  };

  const prevMonth = () => {
    if (mode === 'month') {
      setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1));
    } else {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    }
  };

  const secondMonth = useMemo(() => {
    if (mode === 'month') {
      return new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1);
    }
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  }, [currentMonth, mode]);

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
    if (tempStart && tempEnd && isValidDate(tempStart) && isValidDate(tempEnd)) {
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
        <CalendarIcon className="date-range-picker-icon" size={size === 'xs' || size === 'small' ? 14 : 18} />
        <span>{startDate || t('common.dateRange.start', 'Desde')}</span>
        <ArrowRight size={size === 'xs' || size === 'small' ? 12 : 14} className="date-separator" />
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
                  {mode === 'month' ? currentMonth.getFullYear() : `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}
                </span>
                <div style={{ width: 36 }} />
              </div>
              {mode === 'date' && (
                <div className="date-range-picker-weekdays">
                  {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                    <span key={`${d}-${i}`}>{d}</span>
                  ))}
                </div>
              )}
              <div className={mode === 'month' ? 'date-range-picker-month-grid' : 'date-range-picker-grid'}>
                {mode === 'month' ? renderMonthsCalendar(currentMonth) : renderCalendar(currentMonth)}
              </div>
            </div>

            <div className="date-range-picker-calendar">
              <div className="date-range-picker-header">
                <div style={{ width: 36 }} />
                <span className="date-range-picker-month-title">
                  {mode === 'month' ? secondMonth.getFullYear() : `${monthNames[secondMonth.getMonth()]} ${secondMonth.getFullYear()}`}
                </span>
                <button
                  type="button"
                  className="date-range-picker-nav-btn"
                  onClick={nextMonth}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              {mode === 'date' && (
                <div className="date-range-picker-weekdays">
                  {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                    <span key={`${d}-${i}`}>{d}</span>
                  ))}
                </div>
              )}
              <div className={mode === 'month' ? 'date-range-picker-month-grid' : 'date-range-picker-grid'}>
                {mode === 'month' ? renderMonthsCalendar(secondMonth) : renderCalendar(secondMonth)}
              </div>
            </div>
          </div>

          <div className="date-range-picker-footer">
            <div className="date-range-picker-info-panel">
              <div className="date-range-picker-labels">
                <span className="date-range-picker-label">
                  <CalendarIcon size={14} />
                  {t('common.dateRange.selected', 'Rango seleccionado')}:
                </span>
                <div className="date-range-picker-input-boxes" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="date-range-picker-manual-input"
                    value={tempStart}
                    onChange={(e) => handleManualStartChange(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    readOnly={mode === 'month'}
                  />
                  <ArrowRight size={12} style={{ opacity: 0.5 }} />
                  <input
                    type="text"
                    className="date-range-picker-manual-input"
                    value={tempEnd}
                    onChange={(e) => handleManualEndChange(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    readOnly={mode === 'month'}
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
