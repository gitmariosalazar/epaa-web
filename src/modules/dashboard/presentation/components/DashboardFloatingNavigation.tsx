import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Minimize2, Calendar } from 'lucide-react';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
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
  const { t } = useTranslation();
  const pickerRef = useRef<HTMLInputElement>(null);

  // Format YYYY-MM to MonthName YYYY
  const getFormattedDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');

    // Convert to strict date without timezone shift
    return dateService.formatToLocaleString(`${year}-${month}-02`, {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="dashboard-floating-controls">
      {currentMonth && onMonthChange && (
        <>
          <div
            className="dashboard-float-date"
            onClick={() => pickerRef.current?.showPicker()}
            title={t('dashboard.floatingNav.changePeriod')}
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
        title={t('dashboard.floatingNav.prevWidget')}
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={onClose}
        className="dashboard-float-btn-main"
        title={t('dashboard.floatingNav.exitFullscreen')}
      >
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
          {t('dashboard.floatingNav.exit')}
        </span>
        <Minimize2 size={18} />
      </button>

      <button
        onClick={onNext}
        className="dashboard-float-btn"
        title={t('dashboard.floatingNav.nextWidget')}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
