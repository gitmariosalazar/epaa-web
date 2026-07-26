import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { WorkOrderRequestContext } from './WorkOrderRequestContext';
import type {
  InspectionReportResponse,
  InstallationReportResponse
} from '../../domain/dto/WorkOrderReportResponse';

interface WorkOrderRequestProviderProps {
  children: ReactNode;
}

export const WorkOrderRequestProvider: React.FC<WorkOrderRequestProviderProps> = ({ children }) => {
  const [inspectionReport, setInspectionReport] = useState<InspectionReportResponse | null>(null);
  const [installationReport, setInstallationReport] = useState<InstallationReportResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <WorkOrderRequestContext.Provider
      value={{
        inspectionReport,
        installationReport,
        loading,
        error,
        setInspectionReport,
        setInstallationReport,
        setLoading,
        setError,
      }}
    >
      {children}
    </WorkOrderRequestContext.Provider>
  );
};
