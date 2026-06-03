import type { BeneficioTerceraEdad } from '../../domain/models/BeneficioTerceraEdad';

export const BENEFICIO_TERCERA_EDAD_DATA: BeneficioTerceraEdad = {
  id: 'beneficio-tercera-edad',
  nombre: 'Descuento Tercera Edad',
  descripcion: 'Solicitud de descuento en la planilla de agua potable para ciudadanos adultos mayores (65 años o más).',
  costoTotal: 1,
  tiempoEstimadoDias: 3,
  icono: 'heart',
  color: '#10b981',
  activo: true,
  requisitos: [
    { id: 'bte-01', descripcion: 'Copia de cédula que acredite ser adulto mayor (65 años o más)', tipo: 'documento', nota: 'Cédula de identidad vigente', obligatorio: true },
    { id: 'bte-02', descripcion: 'Última factura de consumo de agua cancelada', tipo: 'documento', nota: 'La más reciente', obligatorio: true },
    { id: 'bte-03', descripcion: 'Formulario de solicitud de descuento por tercera edad', tipo: 'formulario', costo: 1.00, nota: 'Disponible en Ventanillas EPAA-AA', obligatorio: true }
  ]
};
