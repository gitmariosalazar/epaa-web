import React from 'react';
import {
  Droplets, Building2, Users, XCircle, Heart,
  Waves, Gauge, FileCheck, RotateCcw, Factory
} from 'lucide-react';
import { FaWheelchair } from 'react-icons/fa';
import type { CategoriaTramite } from '../../domain/models/Tramite';

// ── Icon registry (OCP) ────────────────
export const ICONS: Record<string, React.ReactNode> = {
  droplets:       <Droplets size={32} />,
  building2:      <Building2 size={32} />,
  users:          <Users size={32} />,
  'x-circle':    <XCircle size={32} />,
  heart:          <Heart size={32} />,
  accessibility:  <FaWheelchair size={28} />,
  waves:          <Waves size={32} />,
  factory:        <Factory size={32} />,
  gauge:          <Gauge size={32} />,
  'file-check':  <FileCheck size={32} />,
  'rotate-ccw':  <RotateCcw size={32} />,
};

// ── Category display metadata (OCP) ──
export const CATEGORY_META: Record<CategoriaTramite, { label: string; icon: React.ReactNode; color: string; descripcion: string }> = {
  nueva_acometida: {
    label: 'Nuevas Acometidas de Agua Potable',
    icon: <Droplets size={18} />,
    color: '#3b82f6',
    descripcion: 'Solicitud de nueva conexión al sistema de agua potable'
  },
  alcantarillado: {
    label: 'Acometidas de Alcantarillado',
    icon: <Waves size={18} />,
    color: '#0ea5e9',
    descripcion: 'Solicitud de nueva conexión al sistema de alcantarillado sanitario'
  },
  cambio_titular: {
    label: 'Cambio de Usuario / Titular',
    icon: <Users size={18} />,
    color: '#f59e0b',
    descripcion: 'Actualización del nombre del titular de la cuenta de agua'
  },
  suspension: {
    label: 'Suspensión del Servicio',
    icon: <XCircle size={18} />,
    color: '#ef4444',
    descripcion: 'Solicitud de suspensión temporal o definitiva del servicio'
  },
  rehabilitacion: {
    label: 'Rehabilitación del Servicio',
    icon: <RotateCcw size={18} />,
    color: '#06b6d4',
    descripcion: 'Reactivación del servicio suspendido por deuda u otras causas'
  },
  medidor: {
    label: 'Medidor de Agua',
    icon: <Gauge size={18} />,
    color: '#f97316',
    descripcion: 'Cambio, reposición o verificación del medidor de consumo'
  },
  certificado: {
    label: 'Certificados',
    icon: <FileCheck size={18} />,
    color: '#10b981',
    descripcion: 'Emisión de certificados oficiales de la EPAA-AA'
  },
  beneficio: {
    label: 'Beneficios Sociales',
    icon: <Heart size={18} />,
    color: '#8b5cf6',
    descripcion: 'Descuentos en planilla para tercera edad y personas con discapacidad'
  }
};

/** Display order for categories */
export const CATEGORY_ORDER: CategoriaTramite[] = [
  'nueva_acometida',
  'alcantarillado',
  'cambio_titular',
  'suspension',
  'rehabilitacion',
  'medidor',
  'certificado',
  'beneficio'
];

export interface PasosProceso {
  numero: number;
  titulo: string;
  descripcion: string;
}

// ── Process steps per category ────
export const PASOS_POR_CATEGORIA: Record<CategoriaTramite, PasosProceso[]> = {
  nueva_acometida: [
    { numero: 1, titulo: 'Registro de Solicitud',    descripcion: 'Ingresa los datos del predio y titular' },
    { numero: 2, titulo: 'Carga de Documentos',      descripcion: 'Adjunta escrituras, cédula y más' },
    { numero: 3, titulo: 'Revisión Técnica',          descripcion: 'Inspección del predio por el equipo EPAA' },
    { numero: 4, titulo: 'Aprobación',                descripcion: 'Resolución y asignación de orden de trabajo' },
    { numero: 5, titulo: 'Instalación',               descripcion: 'Ejecución física de la acometida' },
  ],
  alcantarillado: [
    { numero: 1, titulo: 'Registro de Solicitud',    descripcion: 'Ingresa los datos del predio y titular' },
    { numero: 2, titulo: 'Carga de Documentos',      descripcion: 'Adjunta escrituras, cédula y documentos requeridos' },
    { numero: 3, titulo: 'Inspección Técnica',        descripcion: 'Verificación de factibilidad de conexión al sistema' },
    { numero: 4, titulo: 'Aprobación',                descripcion: 'Resolución técnica y aprobación de conexión' },
    { numero: 5, titulo: 'Conexión al Sistema',       descripcion: 'Ejecución física de la acometida de alcantarillado' },
  ],
  cambio_titular: [
    { numero: 1, titulo: 'Solicitud de Cambio',      descripcion: 'Presenta la solicitud con datos del nuevo titular' },
    { numero: 2, titulo: 'Carga de Documentos',      descripcion: 'Adjunta cédula, escrituras y factura' },
    { numero: 3, titulo: 'Revisión Administrativa',  descripcion: 'El equipo EPAA verifica los datos presentados' },
    { numero: 4, titulo: 'Actualización del Sistema',descripcion: 'Se actualiza el titular en el sistema de facturación' },
  ],
  suspension: [
    { numero: 1, titulo: 'Registro de Solicitud',    descripcion: 'Indica si la suspensión es temporal o definitiva' },
    { numero: 2, titulo: 'Carga de Documentos',      descripcion: 'Adjunta cédula y última factura' },
    { numero: 3, titulo: 'Pago de Tasa',              descripcion: 'Cancela la tasa administrativa en ventanillas' },
    { numero: 4, titulo: 'Ejecución',                 descripcion: 'El equipo técnico realiza el corte o suspensión' },
  ],
  rehabilitacion: [
    { numero: 1, titulo: 'Solicitud de Rehabilitación', descripcion: 'Ingresa la solicitud para reactivar el servicio' },
    { numero: 2, titulo: 'Cancelación de Deuda',      descripcion: 'Paga facturas pendientes en ventanillas o puntos autorizados' },
    { numero: 3, titulo: 'Pago de Tasa',              descripcion: 'Cancela la tasa de rehabilitación' },
    { numero: 4, titulo: 'Reconexión',                descripcion: 'El equipo técnico restablece el servicio en el predio' },
  ],
  medidor: [
    { numero: 1, titulo: 'Registro de Solicitud',    descripcion: 'Indica el motivo: daño, pérdida o robo del medidor' },
    { numero: 2, titulo: 'Carga de Documentos',      descripcion: 'Adjunta cédula y denuncia si aplica' },
    { numero: 3, titulo: 'Pago de Inspección',        descripcion: 'Cancela la tasa técnica en ventanillas' },
    { numero: 4, titulo: 'Cambio de Medidor',         descripcion: 'El equipo técnico instala el nuevo medidor' },
  ],
  certificado: [
    { numero: 1, titulo: 'Registro de Solicitud',    descripcion: 'Ingresa número de cuenta o dirección del predio' },
    { numero: 2, titulo: 'Verificación de Cuenta',   descripcion: 'El sistema verifica el estado de la cuenta' },
    { numero: 3, titulo: 'Pago de Emisión',           descripcion: 'Cancela la tasa de emisión en ventanillas' },
    { numero: 4, titulo: 'Entrega del Certificado',  descripcion: 'Descarga o retira el certificado oficial' },
  ],
  beneficio: [
    { numero: 1, titulo: 'Registro de Solicitud',    descripcion: 'Ingresa tus datos y tipo de beneficio a solicitar' },
    { numero: 2, titulo: 'Carga de Documentos',      descripcion: 'Adjunta cédula, carnet CONADIS o documentación de apoyo' },
    { numero: 3, titulo: 'Revisión Social',           descripcion: 'El área social de EPAA evalúa la solicitud' },
    { numero: 4, titulo: 'Aplicación del Descuento', descripcion: 'El descuento se refleja desde la siguiente planilla' },
  ],
};

// ── Informational notice per category ───────────────────────
export const NOTICE_POR_CATEGORIA: Record<CategoriaTramite, string> = {
  nueva_acometida:  'Reúna todos los documentos antes de iniciar. Los certificados de terceros (Municipio, Registro de la Propiedad) deben ser gestionados directamente por el solicitante.',
  alcantarillado:   'La factibilidad de conexión depende de la existencia de red de alcantarillado en el sector. El equipo técnico lo verificará en la inspección.',
  cambio_titular:   'El cambio de titular aplica cuando hay transferencia de dominio o herencia del inmueble. Se requiere que la cuenta esté al día.',
  suspension:       'La suspensión temporal tiene un plazo máximo definido por la EPAA-AA. La suspensión definitiva implica la desconexión total del servicio.',
  rehabilitacion:   'Para rehabilitar el servicio es obligatorio cancelar la totalidad de la deuda más la tasa de rehabilitación. No se aceptan pagos parciales.',
  medidor:          'En caso de robo, la denuncia policial es obligatoria. El costo del nuevo medidor es asumido por el usuario.',
  certificado:      'El certificado tiene validez de 30 días a partir de su emisión. Se emite únicamente si la cuenta no presenta deudas.',
  beneficio:        'El beneficio aplica sobre el consumo básico mensual. No es acumulable con otros descuentos. Se renueva anualmente.',
};
