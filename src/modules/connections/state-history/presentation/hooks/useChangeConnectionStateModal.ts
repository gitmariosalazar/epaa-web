import { useState, useCallback } from 'react';
import { useStateHistoryContext } from '../context/StateHistoryContext';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import type { ChangeConnectionStateGatewayRequest } from '../../domain/dto/request/change-connection-state.gateway.request';
import type { StateHistory } from '../../domain/models/StateHistory';

export interface UseChangeConnectionStateModalProps {
  onSuccess?: (result: StateHistory) => void;
}

export function useChangeConnectionStateModal({ onSuccess }: UseChangeConnectionStateModalProps = {}) {
  const { useCases } = useStateHistoryContext();

  const [isOpen, setIsOpen] = useState(false);
  const [connectionId, setConnectionId] = useState<string>('');
  const [currentStatusName, setCurrentStatusName] = useState<string | null>(null);

  const [newStateId, setNewStateId] = useState<number | ''>('');
  const [reason, setReason] = useState<string>('');
  const [supportDocument, setSupportDocument] = useState<string>('');
  const [observations, setObservations] = useState<string>('');
  const [origin, setOrigin] = useState<'WEB' | 'APP_MOVIL' | 'CUADRILLA' | 'SISTEMA'>('WEB');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [effectiveDate, setEffectiveDate] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback((connId: string, currentStatus?: string | null) => {
    setConnectionId(connId);
    setCurrentStatusName(currentStatus || null);
    setNewStateId('');
    setReason('');
    setSupportDocument('');
    setObservations('');
    setOrigin('WEB');
    setLatitude(null);
    setLongitude(null);
    setEffectiveDate(new Date().toISOString().slice(0, 16));
    setFile(null);
    setError(null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  const captureGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      MessageToastCustom('warning', 'La geolocalización no es soportada por este navegador.', 'GPS no disponible');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        MessageToastCustom('info', `Coordenadas capturadas: ${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`, 'GPS Capturado');
      },
      (err) => {
        MessageToastCustom('warning', `No se pudo obtener la ubicación: ${err.message}`, 'GPS Error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!connectionId) {
      setError('Identificador de acometida no definido.');
      return;
    }

    if (!newStateId || isNaN(Number(newStateId))) {
      setError('Debe seleccionar el estado destino de la acometida.');
      return;
    }

    if (!reason.trim()) {
      setError('Debe ingresar un motivo o justificación técnica.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: ChangeConnectionStateGatewayRequest = {
        connectionId,
        newStateId: Number(newStateId),
        reason: reason.trim(),
        origin,
        supportDocument: supportDocument.trim() || undefined,
        observations: observations.trim() || undefined,
        latitude: latitude !== null ? latitude : undefined,
        longitude: longitude !== null ? longitude : undefined,
        effectiveDate: effectiveDate ? new Date(effectiveDate).toISOString() : undefined,
        file
      };

      const result = await useCases.changeConnectionStateUseCase.execute(payload, file);

      MessageToastCustom(
        'success',
        `Acometida ${result.connectionId} actualizada exitosamente al estado ${result.newStateName}.`,
        'Cambio de Estado Exitoso'
      );

      closeModal();
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Error al procesar el cambio de estado.';
      setError(errMsg);
      MessageToastCustom('error', errMsg, 'Error al cambiar estado');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    connectionId,
    newStateId,
    reason,
    origin,
    supportDocument,
    observations,
    latitude,
    longitude,
    effectiveDate,
    file,
    useCases,
    closeModal,
    onSuccess
  ]);

  return {
    isOpen,
    connectionId,
    currentStatusName,
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
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    effectiveDate,
    setEffectiveDate,
    file,
    setFile,
    isSubmitting,
    error,
    openModal,
    closeModal,
    captureGeolocation,
    handleSubmit
  };
}
