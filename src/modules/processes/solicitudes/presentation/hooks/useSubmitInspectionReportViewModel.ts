import { useState, useEffect, useCallback } from 'react';
import { SubmitInspectionReportUseCase } from '../../application/usecases/SubmitInspectionReportUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { ProcessWorkOrderRepositoryImpl } from '@/modules/work-orders/infrastructure/repositories/ProcessWorkOrderRepositoryImpl';
import type { OrdenTrabajoDetalle } from '@/modules/work-orders/domain/schemas/dto/response/work-orders.get.response';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

interface UseSubmitInspectionReportViewModelProps {
  solicitudId: string;
  solicitudNumero: string;
  workOrderId: string;
  codigoOrden?: string;
  technicianId: string;
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  allowInconsistentSuccess?: boolean;
}

export const useSubmitInspectionReportViewModel = ({
  solicitudId,
  solicitudNumero,
  workOrderId,
  codigoOrden,
  technicianId,
  isOpen,
  onSuccess,
  onClose,
  allowInconsistentSuccess = false
}: UseSubmitInspectionReportViewModelProps) => {
  // Dependency injection can be improved in a real DI setup, but for now we instantiate here
  const [useCase] = useState(
    () => new SubmitInspectionReportUseCase(new SolicitudRepositoryImpl())
  );
  const [woRepo] = useState(() => new ProcessWorkOrderRepositoryImpl());

  const [result, setResult] = useState('VIABLE');
  const [networkDistanceM, setNetworkDistanceM] = useState('');
  const [connectionDiameter, setConnectionDiameter] = useState('');
  const [observations, setObservations] = useState('');
  const [terrainConditions, setTerrainConditions] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [loading, setLoading] = useState(false);

  const [detalle, setDetalle] = useState<OrdenTrabajoDetalle | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setResult('VIABLE');
      setNetworkDistanceM('');
      setConnectionDiameter('');
      setTerrainConditions('');
      setObservations('');
      setMaterialCost('');
      setLaborCost('');
      setDetalle(null);
    }
  }, [isOpen]);

  // Load details
  useEffect(() => {
    if (!isOpen) return;

    const targetCodigo =
      codigoOrden ||
      (solicitudNumero.startsWith('OT-') ? solicitudNumero : null);

    if (targetCodigo) {
      setLoadingDetalle(true);
      woRepo
        .getOrdenTrabajoDetalleByNumeroOrden(targetCodigo)
        .then((res) => {
          setDetalle(res);
          if (res) {
            const sumMateriales =
              res.materiales?.reduce((acc, m) => acc + (m.subtotal || 0), 0) ||
              0;
            const sumAdicionales =
              res.costosAdicionales?.reduce(
                (acc, c) => acc + (c.total || 0),
                0
              ) || 0;

            if (sumMateriales > 0) {
              setMaterialCost(String(sumMateriales));
            } else if (res.costoTotalMateriales > 0) {
              setMaterialCost(String(res.costoTotalMateriales));
            }

            if (sumAdicionales > 0) {
              setLaborCost(String(sumAdicionales));
            } else if (res.costoTotalAdicionales > 0) {
              setLaborCost(String(res.costoTotalAdicionales));
            }
          }
        })
        .catch(console.error)
        .finally(() => setLoadingDetalle(false));
    }
  }, [isOpen, codigoOrden, solicitudNumero, woRepo]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!workOrderId) {
        MessageToastCustom(
          'error',
          'Error',
          'No se encontró el ID de la orden de trabajo. Recargue la página.'
        );
        return;
      }

      setLoading(true);
      try {
        await useCase.execute({
          workOrderId,
          solicitudId,
          technicianId,
          result,
          networkDistanceM: networkDistanceM
            ? Number(networkDistanceM)
            : undefined,
          connectionDiameter: connectionDiameter.trim() || undefined,
          terrainConditions: terrainConditions.trim() || undefined,
          observations: observations.trim() || undefined,
          materialCost: materialCost ? Number(materialCost) : undefined,
          laborCost: laborCost ? Number(laborCost) : undefined,
          completedStatus: 'INSPECCION_EJECUTADA'
        });
        MessageToastCustom(
          'success',
          'Informe Enviado',
          'El informe técnico fue subido y está en revisión.'
        );
        onSuccess();
        onClose();
      } catch (err: any) {
        const message = String(err?.message ?? 'No se pudo enviar el informe.');
        const looksInconsistent =
          /transici|estado|already|duplicate|duplicad|ya existe|P0001/i.test(
            message
          );

        if (allowInconsistentSuccess && looksInconsistent) {
          MessageToastCustom(
            'warning',
            'Informe registrado',
            'El backend devolvió una respuesta inconsistente. Se actualizará el estado de la OT.'
          );
          onSuccess();
          onClose();
        } else {
          MessageToastCustom('error', 'Error', message);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      useCase,
      workOrderId,
      solicitudId,
      result,
      networkDistanceM,
      connectionDiameter,
      terrainConditions,
      observations,
      materialCost,
      laborCost,
      technicianId,
      allowInconsistentSuccess,
      onSuccess,
      onClose
    ]
  );

  return {
    state: {
      result,
      networkDistanceM,
      connectionDiameter,
      terrainConditions,
      observations,
      materialCost,
      laborCost,
      loading,
      detalle,
      loadingDetalle
    },
    setters: {
      setResult,
      setNetworkDistanceM,
      setConnectionDiameter,
      setTerrainConditions,
      setObservations,
      setMaterialCost,
      setLaborCost
    },
    handlers: {
      handleSubmit
    }
  };
};
