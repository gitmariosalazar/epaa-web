import React from 'react';
import {
  CheckCircle,
  PauseCircle,
  AlertOctagon,
  AlertTriangle,
  Wrench,
  DollarSign,
  PenTool,
  Clock,
  XCircle,
  FileX,
  HelpCircle
} from 'lucide-react';
import { CONNECTION_STATES } from '../../domain/models/ConnectionStateMetadata';

export interface ConnectionStateUIConfig {
  color: string;
  icon: React.ReactNode;
  label: string;
}

export const getConnectionStateUIConfig = (
  nameOrId: string | number
): ConnectionStateUIConfig => {
  let stateName = '';

  if (typeof nameOrId === 'number') {
    const found = Object.values(CONNECTION_STATES).find((s) => s.id === nameOrId);
    if (found) stateName = found.name;
  } else {
    stateName = nameOrId.toUpperCase();
  }

  switch (stateName) {
    case 'ACTIVA':
      return {
        color: 'var(--success, #22c55e)',
        icon: <CheckCircle size={14} />,
        label: 'Activa'
      };
    case 'SUSPENDIDA_VOLUNTARIA':
      return {
        color: 'var(--warning, #f59e0b)',
        icon: <PauseCircle size={14} />,
        label: 'Susp. Voluntaria'
      };
    case 'CORTADA_POR_MORA':
      return {
        color: 'var(--error, #ef4444)',
        icon: <AlertOctagon size={14} />,
        label: 'Cortada por Mora'
      };
    case 'IRREGULAR_FRAUDE':
      return {
        color: 'var(--error, #dc2626)',
        icon: <AlertTriangle size={14} />,
        label: 'Irregular / Fraude'
      };
    case 'DAÑO_TECNICO':
      return {
        color: '#8b5cf6', // purple
        icon: <Wrench size={14} />,
        label: 'Daño Técnico'
      };
    case 'PAGO_PENDIENTE_RECONEXION':
      return {
        color: 'var(--info, #3b82f6)',
        icon: <DollarSign size={14} />,
        label: 'Pago Pendiente Rec.'
      };
    case 'EN_REPARACION':
      return {
        color: '#64748b', // slate
        icon: <PenTool size={14} />,
        label: 'En Reparación'
      };
    case 'NUEVA_PENDIENTE':
      return {
        color: '#6366f1', // indigo
        icon: <Clock size={14} />,
        label: 'Nueva Pendiente'
      };
    case 'CLAUSURADA':
      return {
        color: '#991b1b', // dark red
        icon: <XCircle size={14} />,
        label: 'Clausurada'
      };
    case 'ANULADA_SOLICITUD':
      return {
        color: '#475569', // dark slate
        icon: <FileX size={14} />,
        label: 'Anulada Solicitud'
      };
    default:
      return {
        color: 'var(--text-muted, #9ca3af)',
        icon: <HelpCircle size={14} />,
        label: String(nameOrId) || 'Desconocido'
      };
  }
};
