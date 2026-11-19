import { useState, useCallback } from 'react';
import { useStateHistoryContext } from '../context/StateHistoryContext';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import type { RevertStateHistoryGatewayRequest } from '../../domain/dto/request/revert-state-history.gateway.request';
import type { StateHistory } from '../../domain/models/StateHistory';
import type { ReversibleRecord } from '../../domain/models/ReversibleRecord';

export interface UseRevertStateHistoryModalProps {
  onSuccess?: (result: StateHistory) => void;
}

export function useRevertStateHistoryModal({ onSuccess }: UseRevertStateHistoryModalProps = {}) {
  const { useCases } = useStateHistoryContext();

  const [isOpen, setIsOpen] = useState(false);
  const [connectionId, setConnectionId] = useState<string>('');
  const [reversibleRecord, setReversibleRecord] = useState<ReversibleRecord | null>(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);

  const [historialId, setHistorialId] = useState<number | null>(null);
  const [reason, setReason] = useState<string>('');
  const [supportDocument, setSupportDocument] = useState<string>('');
  const [observations, setObservations] = useState<string>('');
  const [origin, setOrigin] = useState<string>('WEB');
  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback(async (connId: string, specificHistorialId?: number) => {
    setConnectionId(connId);
    setReason('');
    setSupportDocument('');
    setObservations('');
    setOrigin('WEB');
    setFile(null);
    setError(null);
    setIsOpen(true);

    if (specificHistorialId) {
      setHistorialId(specificHistorialId);
    }

    setIsCheckingEligibility(true);
    try {
      const eligibility = await useCases.getReversibleHistoryUseCase.execute(connId);
      setReversibleRecord(eligibility);
      if (!specificHistorialId && eligibility.record?.historialId) {
        setHistorialId(eligibility.record.historialId);
      }
    } catch (err: any) {
      console.warn('Could not check reversibility eligibility:', err);
    } finally {
      setIsCheckingEligibility(false);
    }
  }, [useCases]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setReversibleRecord(null);
    setHistorialId(null);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!historialId) {
      setError('No se identificó ningún registro de historial elegible para reverso.');
      return;
    }

    if (!reason.trim()) {
      setError('Debe justificar el motivo del reverso o corrección.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: RevertStateHistoryGatewayRequest = {
        historialId,
        reason: reason.trim(),
        supportDocument: supportDocument.trim() || undefined,
        observations: observations.trim() || undefined,
        origin,
        file
      };

      const result = await useCases.revertStateHistoryUseCase.execute(payload, file);

      MessageToastCustom(
        'success',
        `Transición #${historialId} revertida exitosamente. Acometida restaurada a ${result.newStateName}.`,
        'Reversión Exitosa'
      );

      closeModal();
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Error al ejecutar la reversión del estado.';
      setError(errMsg);
      MessageToastCustom('error', errMsg, 'Error de Reversión');
    } finally {
      setIsSubmitting(false);
    }
  }, [historialId, reason, supportDocument, observations, origin, file, useCases, closeModal, onSuccess]);

  return {
    isOpen,
    connectionId,
    reversibleRecord,
    isCheckingEligibility,
    historialId,
    reason,
    setReason,
    supportDocument,
    setSupportDocument,
    observations,
    setObservations,
    file,
    setFile,
    isSubmitting,
    error,
    openModal,
    closeModal,
    handleSubmit
  };
}
