import type { Suspension } from '../../domain/models/Suspension';

export const SUSPENSION_DATA: Suspension = {
  id: 'suspension-servicio',
  nombre: 'Suspensión del Servicio',
  descripcion: 'Solicitud de suspensión temporal o definitiva del servicio de agua potable o alcantarillado.',
  tipoPersona: 'ambas',
  costoTotal: 26,
  tiempoEstimadoDias: 3,
  icono: 'x-circle',
  color: '#ef4444',
  activo: true,
  requisitos: [
    { id: 'ss-01', descripcion: 'Solicitud dirigida al Gerente General (motivo: temporal o definitiva)', tipo: 'formulario', costo: 1.00, nota: 'Redactar en papel o solicitar formulario en EPAA-AA', obligatorio: true },
    { id: 'ss-02', descripcion: 'Copia de cédula y papeleta de votación actualizada del titular', tipo: 'documento', nota: 'Del titular de la cuenta', obligatorio: true },
    { id: 'ss-03', descripcion: 'Pago de la tasa administrativa por suspensión', tipo: 'pago', costo: 25.00, nota: 'Ventanillas EPAA-AA', obligatorio: true },
    { id: 'ss-04', descripcion: 'Copia de la última factura cancelada', tipo: 'documento', nota: 'Factura más reciente pagada', obligatorio: true }
  ]
};
