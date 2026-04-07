import React from 'react';
import { AuditProvider } from '../context/AuditContext';
import { AuditDashboard } from '../components/AuditDashboard';

export const AuditPage: React.FC = () => {
  return (
    <AuditProvider>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <AuditDashboard />
      </div>
    </AuditProvider>
  );
};
