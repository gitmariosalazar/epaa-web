import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo
} from 'react';
import { createPortal } from 'react-dom';
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
import {
  createDateConstraintPolicy,
  type DateConstraintProps
} from './dateConstraints';

export interface DateRangePickerProps extends DateConstraintProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  disabled?: boolean;
  size?: 'xs' | 'small' | 'compact' | 'medium' | 'large';
  mode?: 'date' | 'month';
  maxDate?: string;
  label?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  disabled = false,
  size = 'medium',
  mode = 'date',
  maxDate,
  minDate,
  min,
  max,
  allowedRange,
  allowedRanges,
  disabledDates,
  isDateDisabled,
  label = 'Fecha Desde -> Fecha Hasta'
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [hoverDate, setHoverDate] = useState<string>('');

  // SRP / Clean Architecture: Instancia inmutable de la política de restricciones
  const policy = useMemo(() => {
    return createDateConstraintPolicy({
      maxDate,
      minDate,
      min,
      max,
      allowedRange,
      allowedRanges,
      disabledDates,
      isDateDisabled
    });
  }, [
    maxDate,
    minDate,
    min,
    max,
    allowedRange,
    allowedRanges,
    disabledDates,
    isDateDisabled
  ]);

  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [verticalAlign, setVerticalAlign] = useState<'top' | 'bottom'>(
    'bottom'
  );
  const [horizontalAlign, setHorizontalAlign] = useState<
    'left' | 'right' | 'center'
  >('left');

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

  // Posicionamiento inteligente automático que evita desbordar la pantalla
  const updatePopoverPosition = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Si el disparador está completamente fuera de la vista al scrollear, cerramos
    if (rect.bottom < 0 || rect.top > vh) {
      setIsOpen(false);
      return;
    }

    const isMobile = vw < 680;
    const popoverWidth = isMobile ? Math.min(vw - 24, 600) : 640;
    const estimatedHeight = isMobile ? 520 : 435;

    // 1. Alineación Vertical Inteligente (Auto-flip si no cabe abajo)
    const spaceBelow = vh - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const placeAbove = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

    const vAlign = placeAbove ? 'top' : 'bottom';
    setVerticalAlign(vAlign);

    // 2. Alineación Horizontal Inteligente (Auto-flip o Clamp para nunca salir de pantalla)
    let leftStyle: number | undefined;
    let rightStyle: number | undefined;
    let hAlign: 'left' | 'right' | 'center' = 'left';

    if (isMobile) {
      leftStyle = 12;
      hAlign = 'center';
    } else {
      const fitsLeft = rect.left + popoverWidth <= vw - 16;
      const fitsRight = rect.right - popoverWidth >= 16 && rect.right <= vw;

      if (fitsLeft) {
        leftStyle = Math.max(16, rect.left);
        hAlign = 'left';
      } else if (fitsRight) {
        rightStyle = Math.max(16, vw - rect.right);
        hAlign = 'right';
      } else {
        // Clamp dentro de la pantalla
        leftStyle = Math.max(16, Math.min(rect.left, vw - popoverWidth - 16));
        hAlign = 'center';
      }
    }

    setHorizontalAlign(hAlign);

    const style: React.CSSProperties = {
      position: 'fixed',
      zIndex: 99999,
      maxHeight: 'calc(100vh - 24px)',
      overflowY: 'auto'
    };

    if (placeAbove) {
      style.bottom = vh - rect.top + 8;
    } else {
      style.top = rect.bottom + 8;
    }

    if (isMobile) {
      style.left = 12;
      style.right = 12;
      style.width = 'calc(100vw - 24px)';
    } else if (rightStyle !== undefined) {
      style.right = rightStyle;
    } else if (leftStyle !== undefined) {
      style.left = leftStyle;
    }

    setPopoverStyle(style);
  }, []);

  // Calcular posición antes del pintado al abrir
  useLayoutEffect(() => {
    if (isOpen) {
      updatePopoverPosition();
    }
  }, [isOpen, updatePopoverPosition]);

  // Recalcular dinámicamente en scroll o redimensionamiento
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePopoverPosition();
    };

    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, true); // Captura eventos de scroll en cualquier contenedor padre

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, updatePopoverPosition]);

  // Detección de clics fuera y tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInContainer = containerRef.current?.contains(target);
      const isInPopover = popoverRef.current?.contains(target);

      if (!isInContainer && !isInPopover) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (!disabled) {
      if (!isOpen) {
        updatePopoverPosition();
      }
      setIsOpen((prev) => !prev);
    }
  };

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
      const isInRange =
        actualStart &&
        actualEnd &&
        dateStr > actualStart &&
        dateStr < actualEnd;
      const isToday = today === dateStr;
      const isDayDisabled = policy.isDayDisabled(year, month, i);

      days.push(
        <button
          key={i}
          type="button"
          disabled={isDayDisabled}
          className={`date-range-picker-cell 
            ${isStart ? 'date-range-picker-cell--selected date-range-picker-cell--range-start' : ''} 
            ${isEnd ? 'date-range-picker-cell--selected date-range-picker-cell--range-end' : ''} 
            ${isInRange ? 'date-range-picker-cell--in-range' : ''}
            ${isToday ? 'date-range-picker-cell--today' : ''}
            ${isDayDisabled ? 'date-range-picker-cell--disabled' : ''}
          `}
          onClick={() => !isDayDisabled && handleDateClick(dateStr)}
          onMouseEnter={() => !isDayDisabled && setHoverDate(dateStr)}
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
      const isInRange =
        actualStartStr &&
        actualEndStr &&
        cellMonthStr > actualStartStr &&
        cellMonthStr < actualEndStr;
      const isToday = currentTodayMonthStr === cellMonthStr;
      const isMonthDisabled = policy.isMonthDisabled(year, index);

      return (
        <button
          key={index}
          type="button"
          disabled={isMonthDisabled}
          className={`date-range-picker-cell date-range-picker-cell--month
            ${isStart ? 'date-range-picker-cell--selected date-range-picker-cell--range-start' : ''} 
            ${isEnd ? 'date-range-picker-cell--selected date-range-picker-cell--range-end' : ''} 
            ${isInRange ? 'date-range-picker-cell--in-range' : ''}
            ${isToday ? 'date-range-picker-cell--today' : ''}
            ${isMonthDisabled ? 'date-range-picker-cell--disabled' : ''}
          `}
          onClick={() => !isMonthDisabled && handleMonthClick(year, index)}
          onMouseEnter={() => !isMonthDisabled && setHoverDate(`${cellMonthStr}-01`)}
          onMouseLeave={() => setHoverDate('')}
        >
          {monthName.substring(0, 3)}
        </button>
      );
    });
  };

  const nextMonth = () => {
    if (mode === 'month') {
      setCurrentMonth(
        new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1)
      );
    } else {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      );
    }
  };

  const prevMonth = () => {
    if (mode === 'month') {
      setCurrentMonth(
        new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1)
      );
    } else {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
      );
    }
  };

  const secondMonth = useMemo(() => {
    if (mode === 'month') {
      return new Date(
        currentMonth.getFullYear() + 1,
        currentMonth.getMonth(),
        1
      );
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
      {label && <label className="date-range-picker-label">{label}</label>}
      <button
        type="button"
        className={`date-range-picker-trigger date-range-picker--${size} ${isOpen ? 'date-range-picker-trigger--active' : ''} ${disabled ? 'date-range-picker-trigger--disabled' : ''}`}
        onClick={toggleOpen}
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

      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className={`date-range-picker-popover date-range-picker-popover--${verticalAlign} date-range-picker-popover--${horizontalAlign}`}
            style={popoverStyle}
            role="dialog"
            aria-modal="true"
            aria-label={t(
              'common.dateRange.select',
              'Seleccionar rango de fechas'
            )}
          >
            <div className="date-range-picker-calendars">
              <div className="date-range-picker-calendar">
                <div className="date-range-picker-header">
                  <button
                    type="button"
                    className="date-range-picker-nav-btn"
                    onClick={prevMonth}
                    disabled={policy.isPrevNavDisabled(currentMonth, mode)}
                    title={t('common.prevMonth', 'Mes anterior')}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="date-range-picker-month-title">
                    {mode === 'month'
                      ? currentMonth.getFullYear()
                      : `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}
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
                <div
                  className={
                    mode === 'month'
                      ? 'date-range-picker-month-grid'
                      : 'date-range-picker-grid'
                  }
                >
                  {mode === 'month'
                    ? renderMonthsCalendar(currentMonth)
                    : renderCalendar(currentMonth)}
                </div>
              </div>

              <div className="date-range-picker-calendar">
                <div className="date-range-picker-header">
                  <div style={{ width: 36 }} />
                  <span className="date-range-picker-month-title">
                    {mode === 'month'
                      ? secondMonth.getFullYear()
                      : `${monthNames[secondMonth.getMonth()]} ${secondMonth.getFullYear()}`}
                  </span>
                  <button
                    type="button"
                    className="date-range-picker-nav-btn"
                    onClick={nextMonth}
                    disabled={policy.isNextNavDisabled(secondMonth, mode)}
                    title={t('common.nextMonth', 'Mes siguiente')}
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
                <div
                  className={
                    mode === 'month'
                      ? 'date-range-picker-month-grid'
                      : 'date-range-picker-grid'
                  }
                >
                  {mode === 'month'
                    ? renderMonthsCalendar(secondMonth)
                    : renderCalendar(secondMonth)}
                </div>
              </div>
            </div>

            <div className="date-range-picker-footer">
              <div
                className={`date-range-picker-info-panel date-range-picker-info-panel--${size}`}
              >
                <div className="date-range-picker-labels">
                  <span
                    className={`date-range-picker-label date-range-picker-label--${size}`}
                  >
                    <CalendarIcon
                      size={
                        size === 'xs' || size === 'small'
                          ? 13
                          : size === 'large'
                            ? 16
                            : 14
                      }
                    />
                    <span>
                      {t('common.dateRange.selected', 'Rango seleccionado')}:
                    </span>
                  </span>
                  <div className="date-range-picker-input-boxes">
                    <input
                      type="text"
                      className={`date-range-picker-manual-input date-range-picker-manual-input--${size}`}
                      value={tempStart}
                      onChange={(e) => handleManualStartChange(e.target.value)}
                      placeholder="YYYY-MM-DD"
                      readOnly={mode === 'month'}
                      aria-label="Fecha inicial"
                    />
                    <ArrowRight
                      size={
                        size === 'xs' || size === 'small'
                          ? 12
                          : size === 'large'
                            ? 15
                            : 14
                      }
                      className="date-range-picker-arrow"
                    />
                    <input
                      type="text"
                      className={`date-range-picker-manual-input date-range-picker-manual-input--${size}`}
                      value={tempEnd}
                      onChange={(e) => handleManualEndChange(e.target.value)}
                      placeholder="YYYY-MM-DD"
                      readOnly={mode === 'month'}
                      aria-label="Fecha final"
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
          </div>,
          document.body
        )}
    </div>
  );
};
