export type AcometidaStepId = 
  | 'solicitud' 
  | 'documentos' 
  | 'validacion' 
  | 'pago' 
  | 'inspeccion' 
  | 'contrato' 
  | 'instalacion' 
  | 'activo';

export interface AcometidaStep {
  id: AcometidaStepId;
  label: string;
}

export const ACOMETIDA_STEPS: AcometidaStep[] = [
  { id: 'solicitud', label: 'Solicitud' },
  { id: 'documentos', label: 'Documentos' },
  { id: 'validacion', label: 'Validación' },
  { id: 'pago', label: 'Pago' },
  { id: 'inspeccion', label: 'Inspección' },
  { id: 'contrato', label: 'Contrato' },
  { id: 'instalacion', label: 'Instalación' },
  { id: 'activo', label: 'Activo' }
];

export interface TrackingAcometida {
  id: string;
  codigo: string;
  direccion: string;
  fechaCreacion: string;
  currentStep: AcometidaStepId;
  estadoActualLabel: string;
}
