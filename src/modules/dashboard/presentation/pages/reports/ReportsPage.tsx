import { DailyReport } from '@/modules/dashboard/presentation/components/reports/DailyReport';
import { YearlyReport } from '@/modules/dashboard/presentation/components/reports/YearlyReport';
import { ConnectionReport } from '@/modules/dashboard/presentation/components/reports/ConnectionReport';
import { AdvancedReadingsReport } from '@/modules/dashboard/presentation/components/reports/AdvancedReadingsReport';
import { Tabs } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { useReportsViewModel } from '../../hooks/useReportsViewModel';
import '@/shared/presentation/styles/reports.css';
import { useState } from 'react';
import { ReadingDetailModal } from '@/modules/readings/presentation/components/ReadingDetailModal';
import { ConnectionDetailModal } from '@/modules/connections/presentation/components/ConnectionDetailModal';
import { CreateReadingPage } from '@/modules/readings/presentation/pages';
import { UpdateReadingWithImagesPage } from '@/modules/readings/presentation/pages/UpdateReadingWithImagesPage';
import { ReadingsProvider } from '@/modules/readings/presentation/context/ReadingsContext';
import { ConnectionProvider } from '@/modules/connections/presentation/context/ConnectionContext';
import { Modal } from '@/shared/presentation/components/Modal/Modal';

export const ReportsPage = () => {
  const vm = useReportsViewModel();

  // Detail Modal State for Reading
  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    cadastralKey: string;
    yearAndMonth: string | null;
  }>({
    isOpen: false,
    cadastralKey: '',
    yearAndMonth: null,
  });

  // Detail Modal State for Connection
  const [detailCadastralKey, setDetailCadastralKey] = useState<string | null>(null);

  // Modal de Creación / Edición
  const [readingModalState, setReadingModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'update';
    cadastralKey: string;
  } | null>(null);

  const handleViewReadingDetails = (cadastralKey: string, readingDate: Date | null) => {
    let yearAndMonth = null;
    if (readingDate) {
      const d = new Date(readingDate);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      yearAndMonth = `${y}-${m}`;
    }
    setDetailModalState({ isOpen: true, cadastralKey, yearAndMonth });
  };

  const handleAction = (mode: 'create' | 'update', cadastralKey: string) => {
    setReadingModalState({ isOpen: true, mode, cadastralKey });
  };

  const renderFilters = () => {
    switch (vm.activeTab) {
      case 'daily':
        return (
          <DailyReport
            showTable={false}
            externalDate={vm.filters.date}
            onDateChange={vm.filters.setDate}
          />
        );
      case 'yearly':
        return (
          <YearlyReport
            showTable={false}
            externalYear={vm.filters.year}
            onYearChange={vm.filters.setYear}
          />
        );
      case 'connection':
        return (
          <ConnectionReport
            showTable={false}
            externalKey={vm.filters.cadastralKey}
            onKeyChange={vm.filters.setCadastralKey}
          />
        );
      case 'advanced':
        return (
          <AdvancedReadingsReport
            showTable={false}
            externalMonth={vm.filters.month}
            onMonthChange={vm.filters.setMonth}
          />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (vm.activeTab) {
      case 'daily':
        return (
          <DailyReport
            showToolbar={false}
            externalDate={vm.filters.date}
            onDateChange={vm.filters.setDate}
            onAction={handleAction}
            onViewConnectionDetails={setDetailCadastralKey}
            onViewReadingDetails={handleViewReadingDetails}
          />
        );
      case 'yearly':
        return (
          <YearlyReport
            showToolbar={false}
            externalYear={vm.filters.year}
            onYearChange={vm.filters.setYear}
          />
        );
      case 'connection':
        return (
          <ConnectionReport
            showToolbar={false}
            externalKey={vm.filters.cadastralKey}
            onKeyChange={vm.filters.setCadastralKey}
          />
        );
      case 'advanced':
        return (
          <AdvancedReadingsReport
            showToolbar={false}
            externalMonth={vm.filters.month}
            onMonthChange={vm.filters.setMonth}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout
      className="reports-page-container"
      header={
        <Tabs
          tabs={vm.tabs}
          activeTab={vm.activeTab}
          onTabChange={vm.setActiveTab}
        />
      }
      filters={<div className="reports-filters-wrapper">{renderFilters()}</div>}
    >
      <div className="report-main-content">{renderContent()}</div>

      <ReadingsProvider>
        <ReadingDetailModal
          isOpen={detailModalState.isOpen}
          onClose={() => setDetailModalState(prev => ({ ...prev, isOpen: false }))}
          cadastralKey={detailModalState.cadastralKey}
          yearAndMonth={detailModalState.yearAndMonth}
        />
      </ReadingsProvider>

      {/* Modal de Creación/Edición de Lectura */}
      <Modal
        isOpen={!!readingModalState?.isOpen}
        onClose={() => setReadingModalState(null)}
        title={
          readingModalState?.mode === 'create'
            ? 'Nueva Lectura'
            : 'Editar Lectura'
        }
        size="full"
      >
        <ReadingsProvider>
          <div style={{ padding: '0px 10px', height: '100%' }}>
            {readingModalState?.mode === 'create' && (
              <CreateReadingPage
                initialCadastralKey={readingModalState?.cadastralKey}
                onSuccess={() => setReadingModalState(null)}
                onCancel={() => setReadingModalState(null)}
              />
            )}
            {readingModalState?.mode === 'update' && (
              <UpdateReadingWithImagesPage
                initialCadastralKey={readingModalState?.cadastralKey}
                onSuccess={() => setReadingModalState(null)}
                onCancel={() => setReadingModalState(null)}
              />
            )}
          </div>
        </ReadingsProvider>
      </Modal>

      <ConnectionProvider>
        <ConnectionDetailModal
          isOpen={detailCadastralKey !== null}
          onClose={() => setDetailCadastralKey(null)}
          cadastralKey={detailCadastralKey}
        />
      </ConnectionProvider>
    </PageLayout>
  );
};

export default ReportsPage;
