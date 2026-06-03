import { FileText, UploadCloud, User } from 'lucide-react';
import { INITIAL_FORM_ACOMETIDA } from '../../components/forms/FormAcometida';
import type { SolicitudForm } from './types';

export const STEPS = [
  { id: 1, label: 'Datos Personales', icon: <User size={18} /> },
  { id: 2, label: 'Documentos', icon: <UploadCloud size={18} /> },
  { id: 3, label: 'Confirmación', icon: <FileText size={18} /> }
];

export const INITIAL_FORM: SolicitudForm = {
  cedula: '',
  nombres: '',
  apellidos: '',
  email: '',
  telefono: '',
  tipo_persona: 'NATURAL',
  detalles: { ...INITIAL_FORM_ACOMETIDA }
};

export const DEFAULT_TRAMITE_ID = 'nueva-acometida-natural';
