import { DailyReport } from '@/shared/presentation/components/reports/DailyReport';
import { YearlyReport } from '@/shared/presentation/components/reports/YearlyReport';
import { ConnectionReport } from '@/shared/presentation/components/reports/ConnectionReport';
import { AdvancedReadingsReport } from '@/shared/presentation/components/reports/AdvancedReadingsReport';
import { Tabs } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { useReportsViewModel } from '../../hooks/useReportsViewModel';
import '@/shared/presentation/styles/reports.css';

export const ReportsPage = () => {
  const vm = useReportsViewModel();

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
    </PageLayout>
  );
};

export default ReportsPage;
