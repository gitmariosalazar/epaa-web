import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Minimize2, Calendar } from 'lucide-react';
import './DashboardFloatingNavigation.css';

interface DashboardFloatingNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  currentMonth?: string;
  onMonthChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DashboardFloatingNavigation: React.FC<
  DashboardFloatingNavigationProps
> = ({ onPrev, onNext, onClose, currentMonth, onMonthChange }) => {
  const pickerRef = useRef<HTMLInputElement>(null);

  // Format YYYY-MM to MonthName YYYY
  const getFormattedDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }); // Using Spanish locale as per user context
  };

  return (
    <div className="dashboard-floating-controls">
      {currentMonth && onMonthChange && (
        <>
          <div
            className="dashboard-float-date"
            onClick={() => pickerRef.current?.showPicker()}
            title="Change Period"
          >
            <Calendar size={16} className="text-secondary" />
            <span className="date-label">{getFormattedDate(currentMonth)}</span>
            <input
              ref={pickerRef}
              type="month"
              value={currentMonth}
              onChange={onMonthChange}
              className="month-picker-hidden"
            />
          </div>
          <div className="vertical-divider" />
        </>
      )}

      <button
        onClick={onPrev}
        className="dashboard-float-btn"
        title="Previous Widget"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={onClose}
        className="dashboard-float-btn-main"
        title="Exit Fullscreen (Esc)"
      >
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Exit</span>
        <Minimize2 size={18} />
      </button>

      <button
        onClick={onNext}
        className="dashboard-float-btn"
        title="Next Widget"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
