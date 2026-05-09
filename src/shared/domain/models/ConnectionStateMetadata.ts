export interface ConnectionStateMetadata {
  id: number;
  name: string;
  description: string;
  allowsBilling: boolean;
  requiresInspection: boolean;
  allowsReading: boolean;
}

export const CONNECTION_STATES: Record<string, ConnectionStateMetadata> = {
  ACTIVA: {
    id: 1,
    name: 'ACTIVA',
    description: 'Servicio habilitado, medidor operativo y facturación completa.',
    allowsBilling: true,
    requiresInspection: false,
    allowsReading: true
  },
  SUSPENDIDA_VOLUNTARIA: {
    id: 3,
    name: 'SUSPENDIDA_VOLUNTARIA',
    description: 'Suspensión temporal a pedido del usuario (vacaciones/desocupada). Suele cobrar cargo fijo.',
    allowsBilling: true,
    requiresInspection: true,
    allowsReading: true
  },
  CORTADA_POR_MORA: {
    id: 4,
    name: 'CORTADA_POR_MORA',
    description: 'Servicio suspendido por falta de pago. Sigue facturando cargos fijos y multas.',
    allowsBilling: true,
    requiresInspection: false,
    allowsReading: true
  },
  IRREGULAR_FRAUDE: {
    id: 8,
    name: 'IRREGULAR_FRAUDE',
    description: 'Detectada conexión directa o manipulación del medidor. Facturación suspendida por auditoría.',
    allowsBilling: false,
    requiresInspection: true,
    allowsReading: true
  },
  DAÑO_TECNICO: {
    id: 9,
    name: 'DAÑO_TECNICO',
    description: 'Servicio interrumpido por daños en la red interna o fuga no reparada.',
    allowsBilling: false,
    requiresInspection: true,
    allowsReading: true
  },
  PAGO_PENDIENTE_RECONEXION: {
    id: 10,
    name: 'PAGO_PENDIENTE_RECONEXION',
    description: 'Usuario pagó su deuda, servicio listo para ser reconectado por cuadrilla.',
    allowsBilling: true,
    requiresInspection: true,
    allowsReading: true
  },
  EN_REPARACION: {
    id: 11,
    name: 'EN_REPARACION',
    description: 'Acometida intervenida temporalmente por mantenimiento de la empresa.',
    allowsBilling: false,
    requiresInspection: false,
    allowsReading: true
  },
  NUEVA_PENDIENTE: {
    id: 2,
    name: 'NUEVA_PENDIENTE',
    description: 'Acometida aprobada en sistema, pero pendiente de instalación física.',
    allowsBilling: false,
    requiresInspection: true,
    allowsReading: false
  },
  CLAUSURADA: {
    id: 5,
    name: 'CLAUSURADA',
    description: 'Suspensión permanente por decisión de la empresa (deuda incobrable/abandono).',
    allowsBilling: false,
    requiresInspection: true,
    allowsReading: false
  },
  ANULADA_SOLICITUD: {
    id: 6,
    name: 'ANULADA_SOLICITUD',
    description: 'Cierre definitivo de cuenta a solicitud del dueño (por demolición o unificación).',
    allowsBilling: false,
    requiresInspection: true,
    allowsReading: false
  }
};

export class ConnectionStateResolver {
  static getById(id: number): ConnectionStateMetadata | undefined {
    return Object.values(CONNECTION_STATES).find(state => state.id === id);
  }

  static getByName(name: string): ConnectionStateMetadata | undefined {
    if (!name) return undefined;
    return CONNECTION_STATES[name.toUpperCase()];
  }
}
