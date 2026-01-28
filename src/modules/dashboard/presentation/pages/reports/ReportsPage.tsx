import { useState } from 'react';
import { DailyReport } from '@/shared/presentation/components/reports/DailyReport';
import { YearlyReport } from '@/shared/presentation/components/reports/YearlyReport';
import { ConnectionReport } from '@/shared/presentation/components/reports/ConnectionReport';
import '@/shared/presentation/styles/reports.css';
import { Calendar, FileText, Activity } from 'lucide-react';

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'yearly' | 'connection'>(
    'daily'
  );

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Reports Center</h1>
        <p>Generate detailed reports on system readings and anomalies.</p>
      </div>

      <div className="reports-tabs">
        <button
          className={`tab-button ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          <Calendar
            size={16}
            style={{
              display: 'inline',
              marginRight: '8px',
              verticalAlign: 'middle'
            }}
          />
          Daily Report
        </button>
        <button
          className={`tab-button ${activeTab === 'yearly' ? 'active' : ''}`}
          onClick={() => setActiveTab('yearly')}
        >
          <Activity
            size={16}
            style={{
              display: 'inline',
              marginRight: '8px',
              verticalAlign: 'middle'
            }}
          />
          Yearly Summary
        </button>
        <button
          className={`tab-button ${activeTab === 'connection' ? 'active' : ''}`}
          onClick={() => setActiveTab('connection')}
        >
          <FileText
            size={16}
            style={{
              display: 'inline',
              marginRight: '8px',
              verticalAlign: 'middle'
            }}
          />
          Connection History
        </button>
      </div>

      <div className="report-content-area">
        {activeTab === 'daily' && <DailyReport />}
        {activeTab === 'yearly' && <YearlyReport />}
        {activeTab === 'connection' && <ConnectionReport />}
      </div>
    </div>
  );
};

export default ReportsPage;
