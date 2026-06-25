export class CreateIncidentRequest {
  connectionId?: string | null;
  readingId?: number | null;
  incidentTypeId!: number;
  reportDescription!: string;
  referenceAddress?: string | null;
  reportOrigin!:
    | 'LECTURISTA'
    | 'ATENCION_AL_CLIENTE'
    | 'INSPECTOR'
    | 'WEB_USUARIO';
  priority?: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  latitude?: number | null;
  longitude?: number | null;
  images?: string[];
}
