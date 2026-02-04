import { useState } from 'react';
import { DailyReport } from '@/shared/presentation/components/reports/DailyReport';
import { YearlyReport } from '@/shared/presentation/components/reports/YearlyReport';
import { ConnectionReport } from '@/shared/presentation/components/reports/ConnectionReport';
import '@/shared/presentation/styles/reports.css';
import { Calendar, FileText, Activity } from 'lucide-react';
import { AdvancedReadingsReport } from '@/shared/presentation/components/reports/AdvancedReadingsReport';
import { Tabs } from '@/shared/presentation/components/common/Tabs';

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<
    'daily' | 'yearly' | 'connection' | 'advanced'
  >('daily');

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Reports Center</h1>
        <p>Generate detailed reports on system readings and anomalies.</p>
      </div>

      <Tabs
        tabs={[
          {
            id: 'daily',
            label: 'Daily Report',
            icon: <Calendar size={16} />
          },
          {
            id: 'yearly',
            label: 'Yearly Summary',
            icon: <Activity size={16} />
          },
          {
            id: 'connection',
            label: 'Connection History',
            icon: <FileText size={16} />
          },
          {
            id: 'advanced',
            label: 'Advanced Readings',
            icon: <FileText size={16} />
          }
        ]}
        activeTab={activeTab}
        onTabChange={(id) =>
          setActiveTab(id as 'daily' | 'yearly' | 'connection' | 'advanced')
        }
        variant="underline"
        className="reports-tabs"
      />

      <div className="report-content-area">
        {activeTab === 'daily' && <DailyReport />}
        {activeTab === 'yearly' && <YearlyReport />}
        {activeTab === 'connection' && <ConnectionReport />}
        {activeTab === 'advanced' && <AdvancedReadingsReport />}
      </div>
    </div>
  );
};

export default ReportsPage;
