import { useContext, useCallback, useMemo } from 'react';
import { WorkOrderRequestContext } from '../context/WorkOrderRequestContext';
import { WorkOrderRequestUseCase } from '../../application/usecases/WorkOrderRequestUseCase';
import { WorkOrderRepositoryImpl } from '../../infrastructure/repositories/WorkOrderRepositoryImpl';

/**
 * Composition Root local para instanciar el Use Case.
 * En proyectos más grandes, esto suele venir de un contenedor DI (Inversify, tsyringe, etc.)
 */
const defaultRepository = new WorkOrderRepositoryImpl();
const defaultUseCase = new WorkOrderRequestUseCase(defaultRepository);

export const useWorkOrderRequestViewModel = (
  useCase: WorkOrderRequestUseCase = defaultUseCase
) => {
  const context = useContext(WorkOrderRequestContext);

  if (!context) {
    throw new Error(
      'useWorkOrderRequestViewModel debe usarse dentro de un WorkOrderRequestProvider'
    );
  }

  const {
    inspectionReport,
    installationReport,
    loading,
    error,
    setInspectionReport,
    setInstallationReport,
    setLoading,
    setError,
  } = context;

  const fetchInspectionReport = useCallback(
    async (orderCodeOrRequestNumber: string) => {
      setLoading(true);
      setError(null);
      try {
        const inspection = await useCase.getWorkOrderInspectionDetailByOrderCodeOrRequestNumber(
          orderCodeOrRequestNumber
        );
        setInspectionReport(inspection);
      } catch (err: any) {
        setError(err.message || 'Error al obtener el informe de inspección');
        setInspectionReport(null);
      } finally {
        setLoading(false);
      }
    },
    [useCase, setInspectionReport, setLoading, setError]
  );

  const fetchInstallationReport = useCallback(
    async (orderCodeOrRequestNumber: string) => {
      setLoading(true);
      setError(null);
      try {
        const installation = await useCase.getWorkOrderInstallationDetailByOrderCodeOrRequestNumber(
          orderCodeOrRequestNumber
        );
        setInstallationReport(installation);
      } catch (err: any) {
        setError(err.message || 'Error al obtener el informe de instalación');
        setInstallationReport(null);
      } finally {
        setLoading(false);
      }
    },
    [useCase, setInstallationReport, setLoading, setError]
  );

  return useMemo(
    () => ({
      inspectionReport,
      installationReport,
      loading,
      error,
      fetchInspectionReport,
      fetchInstallationReport,
    }),
    [inspectionReport, installationReport, loading, error, fetchInspectionReport, fetchInstallationReport]
  );
};
