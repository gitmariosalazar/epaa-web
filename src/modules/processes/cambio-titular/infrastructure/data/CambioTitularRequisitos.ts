import type { CambioTitular } from '../../domain/models/CambioTitular';

export const CAMBIO_TITULAR_DATA: CambioTitular = {
  id: 'cambio-titular',
  nombre: 'Cambio de Usuario / Titular',
  descripcion: 'Trámite para actualizar el nombre del titular registrado en la cuenta de agua potable.',
  tipoPersona: 'ambas',
  costoTotal: 5,
  tiempoEstimadoDias: 5,
  icono: 'users',
  color: '#f59e0b',
  activo: true,
  requisitos: [
    { id: 'ct-01', descripcion: 'Copia de cédula y papeleta de votación del nuevo titular', tipo: 'documento', nota: 'Documentos vigentes', obligatorio: true },
    { id: 'ct-02', descripcion: 'Última factura de consumo cancelada', tipo: 'documento', nota: 'La más reciente', obligatorio: true },
    { id: 'ct-03', descripcion: 'Escrituras públicas inscritas en el Registro de la Propiedad', tipo: 'documento', nota: 'Copia notariada o simple según el caso', obligatorio: true },
    { id: 'ct-04', descripcion: 'Pago del impuesto predial del año en curso', tipo: 'documento', nota: 'Año vigente', obligatorio: true },
    { id: 'ct-05', descripcion: 'Formulario de solicitud de cambio de titular — Persona Natural', tipo: 'formulario', costo: 3.00, nota: 'Disponible en Ventanillas EPAA-AA ($3.00)', obligatorio: true },
    { id: 'ct-06', descripcion: 'Formulario de solicitud de cambio de titular — Persona Jurídica', tipo: 'formulario', costo: 5.00, nota: 'Solo aplica para personas jurídicas ($5.00)', obligatorio: false }
  ]
};
