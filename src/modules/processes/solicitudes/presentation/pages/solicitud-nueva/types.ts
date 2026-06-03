export interface SolicitudForm {
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  tipo_persona: 'NATURAL' | 'JURIDICA';
  detalles: Record<string, any>;
}
