import React from 'react';
import {
  BsStars,
  BsClockHistory,
  BsQuestionCircle,
  BsCheckCircle,
  BsExclamationCircle,
  BsExclamationTriangle,
  BsXOctagon
} from 'react-icons/bs';

const getWorkOrderStatusColor = (status: string | null | undefined) => {
  if (!status) return 'gray';

  switch (status.toUpperCase()) {
    // Estados Iniciales / Pendientes
    case 'NOTIFICADA':
      return 'gray'; // Gris
    case 'PENDIENTE':
      return 'yellow'; // Amarillo
    case 'ASIGNADA':
      return 'blue'; // Azul

    // Estados de Acción / Trabajo
    case 'PREPARACION':
      return 'teal'; // Verde azulado (o puedes usar 'cyan'/'blue')
    case 'EN_PROCESO':
      return 'orange'; // Naranja (trabajo activo)

    // Estados de Finalización
    case 'EJECUTADA':
      return 'lime'; // Verde claro (terminó en campo pero falta cierre)
    case 'COMPLETADA':
      return 'green'; // Verde oscuro (éxito total)

    // Estados de Falla / Rechazo
    case 'REVISION_RECHAZADA':
    case 'RECHAZADA_TECNICA':
    case 'CANCELADA':
      return 'red'; // Rojo

    default:
      return 'gray';
  }
};

// ── Helpers de color (aislados aquí, no en el ViewModel) ─────────────────
const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'RESUELTO':
      return 'green';
    case 'EN_INSPECCION':
      return 'orange';
    case 'REPORTADO':
      return 'yellow';
    case 'FALSO_REPORTE':
      return 'red';
    default:
      return 'gray';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority.toUpperCase()) {
    case 'CRITICA':
      return 'red';
    case 'ALTA':
      return 'orange';
    case 'MEDIA':
      return 'yellow';
    case 'BAJA':
      return 'cyan';
    default:
      return 'gray';
  }
};



// 'NUEVO', 'ANTIGUO', 'NO_IDENTIFICADO'
const getMeterConditionColor = (status: string): { color: string, label: string, icon: React.JSX.Element } => {
  switch (status.toUpperCase()) {
    case 'NUEVO':
      return { color: 'green', label: 'Nuevo', icon: <BsStars size={18} /> };
    case 'ANTIGUO':
      return { color: 'orange', label: 'Antiguo', icon: <BsClockHistory size={18} /> };
    case 'NO_IDENTIFICADO':
      return { color: 'red', label: 'No Identificado', icon: <BsQuestionCircle size={18} /> };
    default:
      return { color: 'gray', label: 'Desconocido', icon: <BsQuestionCircle size={18} /> };
  }
};
// 'BUENO', 'REGULAR', 'MALO', 'DESTRUIDO'
const getPhysicalStateColor = (status: string): { color: string, label: string, icon: React.JSX.Element } => {
  switch (status.toUpperCase()) {
    case 'BUENO':
      return { color: 'green', label: 'Bueno', icon: <BsCheckCircle size={18} /> };
    case 'REGULAR':
      return { color: 'orange', label: 'Regular', icon: <BsExclamationCircle size={18} /> };
    case 'MALO':
      return { color: 'red', label: 'Malo', icon: <BsExclamationTriangle size={18} /> };
    case 'DESTRUIDO':
      return { color: 'black', label: 'Destruido', icon: <BsXOctagon size={18} /> };
    default:
      return { color: 'gray', label: 'No Identificado', icon: <BsQuestionCircle size={18} /> };
  }
};

export {
  getWorkOrderStatusColor,
  getStatusColor,
  getPriorityColor,
  getMeterConditionColor,
  getPhysicalStateColor
};
