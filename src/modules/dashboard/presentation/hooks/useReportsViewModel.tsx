import { useState, useMemo } from 'react';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { useTranslation } from 'react-i18next';
import { Calendar, FileText, Activity } from 'lucide-react';
import type { TabItem } from '@/shared/presentation/components/Tabs/Tabs';

export type ReportTabId = 'daily' | 'yearly' | 'connection' | 'advanced';

export const useReportsViewModel = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ReportTabId>('daily');

  const tabs = useMemo<TabItem<ReportTabId>[]>(
    () => [
      {
        id: 'daily',
        label: t('dashboard.reports.tabs.daily', 'Reporte Diario'),
        icon: <Calendar size={16} />
      },
      {
        id: 'yearly',
        label: t('dashboard.reports.tabs.yearly', 'Resumen Anual'),
        icon: <Activity size={16} />
      },
      {
        id: 'connection',
        label: t('dashboard.reports.tabs.connection', 'Historial'),
        icon: <FileText size={16} />
      },
      {
        id: 'advanced',
        label: t('dashboard.reports.tabs.advanced', 'Reporte de Avance'),
        icon: <FileText size={16} />
      }
    ],
    [t]
  );

  const [date, setDate] = useState<string>(dateService.getCurrentDateString());
  const [month, setMonth] = useState<string>(
    dateService.getCurrentMonthString()
  );
  const [year, setYear] = useState<number>(
    dateService.getCurrentDate().getFullYear()
  );
  const [cadastralKey, setCadastralKey] = useState<string>('1-1');

  return {
    activeTab,
    setActiveTab,
    tabs,
    filters: {
      date,
      setDate,
      month,
      setMonth,
      year,
      setYear,
      cadastralKey,
      setCadastralKey
    }
  };
};
