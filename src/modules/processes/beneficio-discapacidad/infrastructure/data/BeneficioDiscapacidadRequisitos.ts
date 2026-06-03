import type { BeneficioDiscapacidad } from '../../domain/models/BeneficioDiscapacidad';

export const BENEFICIO_DISCAPACIDAD_DATA: BeneficioDiscapacidad = {
  id: 'beneficio-discapacidad',
  nombre: 'Descuento por Discapacidad',
  descripcion: 'Solicitud de descuento en la planilla de agua potable para personas con discapacidad reconocida.',
  costoTotal: 1,
  tiempoEstimadoDias: 3,
  icono: 'accessibility',
  color: '#8b5cf6',
  activo: true,
  requisitos: [
    { id: 'bd-01', descripcion: 'Copia de cédula del beneficiario', tipo: 'documento', nota: 'Cédula de identidad vigente', obligatorio: true },
    { id: 'bd-02', descripcion: 'Carnet de CONADIS o certificado del Ministerio de Salud', tipo: 'documento', nota: 'Documento que acredite la condición de discapacidad. Vigente.', obligatorio: true },
    { id: 'bd-03', descripcion: 'Última factura de consumo de agua cancelada', tipo: 'documento', nota: 'La más reciente', obligatorio: true },
    { id: 'bd-04', descripcion: 'Formulario de solicitud de descuento por discapacidad', tipo: 'formulario', costo: 1.00, nota: 'Disponible en Ventanillas EPAA-AA', obligatorio: true }
  ]
};
