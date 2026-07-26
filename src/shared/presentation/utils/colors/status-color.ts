const getWorkOrderStatusColor = (status: string | null | undefined) => {
  if (!status) return 'neutral';

  switch (status.toUpperCase()) {
    // Estados Iniciales / Pendientes
    case 'NOTIFICADA':
      return 'neutral'; // Gris
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
      return 'neutral';
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
      return 'neutral';
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
      return 'neutral';
  }
};

export { getWorkOrderStatusColor, getStatusColor, getPriorityColor };
