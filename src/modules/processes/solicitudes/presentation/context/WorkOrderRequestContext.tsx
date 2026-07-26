import { createContext } from 'react';
import type {
  InspectionReportResponse,
  InstallationReportResponse
} from '../../domain/dto/WorkOrderReportResponse';

interface WorkOrderRequestContextType {
  inspectionReport: InspectionReportResponse | null;
  installationReport: InstallationReportResponse | null;
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInspectionReport: (
    inspectionReport: InspectionReportResponse | null
  ) => void;
  setInstallationReport: (
    installationReport: InstallationReportResponse | null
  ) => void;
}

export const WorkOrderRequestContext =
  createContext<WorkOrderRequestContextType | null>(null);