import { useState, useCallback } from 'react';
import { useStateHistoryContext } from '../context/StateHistoryContext';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import type { BulkChangeConnectionStateGatewayRequest } from '../../domain/dto/request/bulk-change-connection-state.gateway.request';
import type { BulkStateChangeResult } from '../../domain/models/StateHistory';

export interface UseBulkChangeStateModalProps {
  onSuccess?: (result: BulkStateChangeResult) => void;
}

export function useBulkChangeStateModal({ onSuccess }: UseBulkChangeStateModalProps = {}) {
  const { useCases } = useStateHistoryContext();

  const [isOpen, setIsOpen] = useState(false);
  const [connectionIds, setConnectionIds] = useState<string[]>([]);
  const [newStateId, setNewStateId] = useState<number | ''>('');
  const [reason, setReason] = useState<string>('');
  const [supportDocument, setSupportDocument] = useState<string>('');
  const [observations, setObservations] = useState<string>('');
  const [origin, setOrigin] = useState<string>('WEB');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<BulkStateChangeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback((ids: string[]) => {
    setConnectionIds(ids);
    setNewStateId('');
    setReason('');
    setSupportDocument('');
    setObservations('');
    setOrigin('WEB');
    setResult(null);
    setError(null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setResult(null);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!connectionIds || connectionIds.length === 0) {
      setError('No hay acometidas seleccionadas.');
      return;
    }

    if (!newStateId || isNaN(Number(newStateId))) {
      setError('Debe seleccionar el estado destino masivo.');
      return;
    }

    if (!reason.trim()) {
      setError('Debe indicar la justificación u orden de campaña para la transición masiva.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: BulkChangeConnectionStateGatewayRequest = {
        connectionIds,
        newStateId: Number(newStateId),
        reason: reason.trim(),
        supportDocument: supportDocument.trim() || undefined,
        observations: observations.trim() || undefined,
        origin
      };

      const res = await useCases.bulkChangeConnectionStateUseCase.execute(payload);
      setResult(res);

      MessageToastCustom(
        'success',
        `Transición masiva completada: ${res.totalUpdated}/${res.totalRequested} acometidas pasaron a ${res.newStateName}.`,
        'Campaña Procesada'
      );

      if (onSuccess) {
        onSuccess(res);
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Error en la transición masiva de estados.';
      setError(errMsg);
      MessageToastCustom('error', errMsg, 'Error en Transición Masiva');
    } finally {
      setIsSubmitting(false);
    }
  }, [connectionIds, newStateId, reason, supportDocument, observations, origin, useCases, onSuccess]);

  return {
    isOpen,
    connectionIds,
    newStateId,
    setNewStateId,
    reason,
    setReason,
    supportDocument,
    setSupportDocument,
    observations,
    setObservations,
    origin,
    setOrigin,
    isSubmitting,
    result,
    error,
    openModal,
    closeModal,
    handleSubmit
  };
}
